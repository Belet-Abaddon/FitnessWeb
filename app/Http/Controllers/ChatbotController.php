<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    public function chat(Request $request)
    {
        set_time_limit(120);

        $user = Auth::user() ?? User::find(1);
        $userInput = $request->input('message');

        if (!$userInput || !$user) {
            return response()->json(['reply' => 'Please provide a message.'], 400);
        }

        try {
            $ragContext = $this->getFitnessContextFromMongo($userInput);

            $systemInstruction = $this->prepareContext($user, $ragContext);

            $history = ChatMessage::where('user_id', $user->id)
                ->latest()
                ->take(3)
                ->get()
                ->reverse();

            $reply = $this->callGroqApi($userInput, $systemInstruction, $history);

            ChatMessage::create([
                'user_id' => $user->id,
                'message' => $userInput,
                'reply'   => $reply
            ]);

            return response()->json(['reply' => $reply]);
        } catch (\Exception $e) {
            Log::error("Chatbot Error: " . $e->getMessage());
            return response()->json([
                'reply' => '⚠️ Sorry! Connection fail.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function getFitnessContextFromMongo($text)
    {
        try {
            $ollamaResponse = Http::timeout(30)->post("http://ollama:11434/api/embeddings", [
                "model" => "mxbai-embed-large",
                "prompt" => $text
            ]);

            if ($ollamaResponse->failed()) return "";

            $vector = $ollamaResponse->json()['embedding'] ?? null;
            if (!$vector) return "";

            $results = DB::connection('mongodb')
                ->table('fitness_rag_store')
                ->raw(function ($collection) use ($vector) {
                    return $collection->aggregate([
                        [
                            '$vectorSearch' => [ 
                                'index' => 'vector_index',
                                'path' => 'embedding',
                                'queryVector' => $vector,
                                'numCandidates' => 100,
                                'limit' => 5
                            ]
                        ],
                        [
                            '$project' => [
                                'text' => 1,
                                'score' => ['$meta' => 'vectorSearchScore']
                            ]
                        ]
                    ]);
                });

            $contextText = "";
            foreach ($results as $res) {
                $data = (object) $res;
                if (isset($data->text)) {
                    $contextText .= "- " . $data->text . "\n";
                }
            }
            return $contextText;
        } catch (\Exception $e) {
            Log::warning("Vector Search Error: " . $e->getMessage());
            return "";
        }
    }

    private function prepareContext($user, $ragContext = "")
    {
        $bmi = $user->current_bmi;
        $adviceType = $bmi >= 30 ? "OBESE" : ($bmi >= 25 ? "OVERWEIGHT" : "NORMAL");

        return "
You are a Fitness Information Assistant. Your ONLY job is to relay information exactly as it is found in the provided DATABASE CONTEXT.

STRICT OPERATING RULES:
1. If the user asks for a recommendation (e.g., 'What should I do?'), you must check the DATABASE CONTEXT. If the context contains a specific exercise plan or advice, summarize ONLY that data.
2. DO NOT create your own recommendations, sets, reps, or rest periods if they are not explicitly written in the DATABASE CONTEXT.
3. If the DATABASE CONTEXT is empty or does not contain the specific answer, you MUST say: 'I am sorry, but I do not have that specific information in my records. I can only provide details based on our verified fitness database.'
4. NEVER provide medical advice or drug names.
5. Do not use phrases like 'I recommend' or 'You should' unless that exact advice is in the database.
6. When providing information about a workout plan, always start with a brief description followed by the complete exercise schedule (Day, Exercise Name, and Duration) in a clear list format.

USER PROFILE:
- BMI: {$user->current_bmi} ({$adviceType})

DATABASE CONTEXT:
" . ($ragContext ?: "NO DATA FOUND IN DATABASE.");
    }

    private function callGroqApi($userInput, $systemInstruction, $history)
    {
        $apiKey = env('GROQ_API_KEY');
        $messages = [['role' => 'system', 'content' => $systemInstruction]];

        foreach ($history as $chat) {
            $messages[] = ['role' => 'user', 'content' => $chat->message];
            $messages[] = ['role' => 'assistant', 'content' => $chat->reply];
        }

        $messages[] = ['role' => 'user', 'content' => $userInput];

        $response = Http::withToken($apiKey)
            ->timeout(60)
            ->post("https://api.groq.com/openai/v1/chat/completions", [
                'model' => 'llama-3.1-8b-instant',
                'messages' => $messages,
                'temperature' => 0.0,
                'max_tokens' => 1500,
            ]);

        return $response->json()['choices'][0]['message']['content'] ?? 'AI Service Error.';
    }

    public function getHistory()
    {
        return ChatMessage::where('user_id', Auth::id() ?? 1)->orderBy('created_at', 'asc')->get();
    }
}
