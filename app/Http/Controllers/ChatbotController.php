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
            $ollamaResponse = Http::timeout(30)->post("http://localhost:11434/api/embeddings", [
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
                                'numCandidates' => 200, 
                                'limit' => 20 
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
        $adviceType = $bmi >= 30 ? "OBESE (Target: 1500-1700 kcal)" : ($bmi >= 25 ? "OVERWEIGHT (Target: 1800-2000 kcal)" : "NORMAL (Target: 2000-2200 kcal)");

        return "
You are a Professional Fitness AI Coach. 

STRICT INSTRUCTIONS:
1. Use ONLY the 'DATABASE CONTEXT' section below to provide detailed and accurate answers.
2. ALWAYS complete your sentences. Do not stop mid-sentence. 
3. If you find specific data (like calories, protein, or exercise steps), list them CLEARLY and FULLY.
4. If the requested information is NOT in the database context, respond with: 'I am sorry, but I do not have that specific information in my records. I can only provide details based on our verified fitness database.'
5. Use plain text only. Do not use Markdown, bolding, or hashtags.
6. If the data provides specific numbers (like calories or protein), you MUST report them EXACTLY as they appear in the database. DO NOT round the numbers.
7. MEDICAL RESTRICTION: Do NOT provide any medical advice, medication dosages, or drug recommendations (e.g., Aspirin, Ibuprofen, etc.). 
8. If a user asks for medical advice, respond with: I am sorry, but I cannot provide medical advice or medication recommendations. Please consult a healthcare professional.

USER PROFILE:
- Age: {$user->age}, Weight: {$user->weight}kg, BMI: {$user->current_bmi}
- Fitness Goal: {$adviceType}

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