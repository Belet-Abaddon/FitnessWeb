<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

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
            $ollamaResponse = Http::timeout(30)->post("http://localhost:11434/api/embeddings", [
                "model" => "mxbai-embed-large",
                "prompt" => $text
            ]);

            if ($ollamaResponse->failed()) return "";

            $vector = $ollamaResponse->json()['embedding'] ?? null;
            if (!$vector) return "";

            // MongoDB Vector Search
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
        // BMI Based Calorie Targeting Logic
        $bmi = $user->current_bmi;
        $adviceType = "";
        
        if ($bmi < 18.5) {
            $adviceType = "UNDERWEIGHT: Focus on High Protein and High Calorie surplus. Target ~2500+ kcal.";
        } elseif ($bmi >= 30) {
            $adviceType = "OBESE/OVERWEIGHT: Focus on Calorie Deficit and high fiber. Target ~1500-1700 kcal.";
        } elseif ($bmi >= 25) {
            $adviceType = "OVERWEIGHT: Focus on moderate calorie deficit. Target ~1800-2000 kcal.";
        } else {
            $adviceType = "NORMAL: Focus on maintenance and balanced nutrition. Target ~2000-2200 kcal.";
        }

        return "
You are a Strict Database-Only Fitness AI. 

GOAL: Use ONLY the provided 'DATABASE CONTEXT' to answer questions. 

STRICT RULES:
1. If the answer is NOT present in the DATABASE CONTEXT, say: 'I am sorry, but I do not have that specific information in my records. I can only provide details based on our verified fitness database.'
2. If the user asks anything non-fitness related (cooking steps, news, general facts), politely decline.
3. For MEAL PLAN requests: Select appropriate items from the DATABASE CONTEXT that match the user's BMI goal.

USER DATA:
- Age: {$user->age}
- Weight: {$user->weight} kg
- BMI: {$user->current_bmi}
- Goal Recommendation: {$adviceType}

DATABASE CONTEXT:
" . ($ragContext ?: "NO INFORMATION AVAILABLE IN DATABASE.") . "
";
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
                'temperature' => 0.2,
                'max_tokens' => 500,
            ]);

        return $response->json()['choices'][0]['message']['content'] ?? 'AI Service Error.';
    }

    public function getHistory()
    {
        return ChatMessage::where('user_id', Auth::id() ?? 1)->orderBy('created_at', 'asc')->get();
    }
}