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

        Log::info("--- New Chat Request ---");
        Log::info("User Input: " . $userInput);

        try {
            $ragContext = $this->getFitnessContextFromMongo($userInput);

            if (empty($ragContext)) {
                Log::warning("⚠️ Debug: No Context found in MongoDB for this query.");
            } else {
                Log::info("✅ Debug: Context found successfully.");
            }

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
            Log::error("❌ Chatbot Fatal Error: " . $e->getMessage());
            return response()->json([
                'reply' => '⚠️ Sorry! Connection fail.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function getFitnessContextFromMongo(string $text): string
    {
        try {
            $ollamaResponse = Http::timeout(30)->post("http://ollama:11434/api/embeddings", [
                "model" => "mxbai-embed-large",
                "prompt" => $text
            ]);

            if ($ollamaResponse->failed()) {
                Log::error("❌ Ollama API Error: " . $ollamaResponse->body());
                return "";
            }

            $vector = $ollamaResponse->json()['embedding'] ?? null;
            if (!$vector) {
                Log::error("❌ No Vector generated from Ollama.");
                return "";
            }

            Log::info("🔍 Debug: Attempting MongoDB Vector Search...");

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
            $count = 0;
            foreach ($results as $res) {
                $count++;
                $data = (object) $res;
                if (isset($data->text)) {
                    $contextText .= "- " . $data->text . "\n";
                }
            }

            Log::info("📊 Debug: MongoDB returned " . $count . " matching documents.");
            return $contextText;
        } catch (\Exception $e) {
            Log::warning("⚠️ Vector Search Exception: " . $e->getMessage());
            return "";
        }
    }

    private function prepareContext(User $user, string $ragContext = ""): string
    {
        $bmi = $user->current_bmi;
        $adviceType = $bmi >= 30 ? "OBESE" : ($bmi >= 25 ? "OVERWEIGHT" : "NORMAL");

        $finalInstruction = "
        You are a Fitness Information Assistant. Your ONLY job is to relay information exactly as it is found in the provided DATABASE CONTEXT.

STRICT OPERATING RULES:
1. DATA-DRIVEN ONLY: You MUST rely ONLY on the provided DATABASE CONTEXT. Do NOT create your own recommendations, sets, reps, or rest periods if they are not explicitly in the context.

2. MEAL PLAN RESTRICTION & LOGIC: If the user asks for a 'Meal Plan' based on their BMI ($bmi - $adviceType), you MUST search the context for 'Nutrition' data. Combine these found nutrition items into a daily meal plan format (Breakfast, Lunch, Dinner).

3. FULL EXERCISE PLAN DISPLAY: If the user asks about a specific exercise plan, you MUST display ALL information found in the context, including the Goal, Focus, and the COMPLETE day-by-day workout schedule. Do NOT summarize or skip any days.

4. STRICT REFUSAL: If the context is empty or doesn't contain the specific answer, you MUST say exactly: 'I am sorry, but I do not have that specific information in my records. I can only provide details based on our verified fitness database.'

5. NO MEDICAL ADVICE: NEVER provide medical advice or drug names.

6. OBJECTIVE TONE: Do not use phrases like 'I recommend' or 'You should' unless that exact advice is in the database. Always present the workout schedule in a clear list format.

        USER PROFILE: BMI {$bmi}
        DATABASE CONTEXT: " . ($ragContext ?: "NO DATA FOUND IN DATABASE.");

        return $finalInstruction;
    }

    private function callGroqApi(string $userInput, string $systemInstruction, iterable $history): string
    {
        Log::info("📡 Debug: Calling Groq API...");

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
            ]);

        if ($response->failed()) {
            Log::error("❌ Groq API Error: " . $response->body());
            return "AI Service Error.";
        }

        return $response->json()['choices'][0]['message']['content'] ?? 'AI Service Error.';
    }

    public function getHistory()
    {
        return ChatMessage::where('user_id', Auth::id() ?? 1)->orderBy('created_at', 'asc')->get();
    }
}
