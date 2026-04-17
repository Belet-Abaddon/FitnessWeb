<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
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

        $user = Auth::user() ?? \App\Models\User::find(1);
        $userInput = $request->input('message');

        if (!$userInput || !$user) {
            return response()->json(['reply' => 'User or Message not found.'], 400);
        }

        try {
            $nutritionContext = $this->getNutritionContext($userInput);
            $context = $this->prepareContext($user, $nutritionContext);

            $history = ChatMessage::where('user_id', $user->id)
                ->latest()
                ->take(5)
                ->get()
                ->reverse();

            $reply = $this->callGeminiApi($userInput, $context, $history);

            ChatMessage::create([
                'user_id' => $user->id,
                'message' => $userInput,
                'reply'   => $reply
            ]);

            return response()->json(['reply' => $reply]);
        } catch (\Exception $e) {
            Log::error("Chatbot Error: " . $e->getMessage());

            return response()->json([
                'reply' => 'I am having trouble connecting. Please try again.',
                'error_detail' => $e->getMessage()
            ], 500);
        }
    }

    private function getNutritionContext($text)
    {
        try {
            // Ollama အစား Mixedbread API ကို လှမ်းခေါ်ခြင်း
            $response = Http::timeout(10)
                ->withToken(env('MIXEDBREAD_API_KEY'))
                ->post("https://api.mixedbread.ai/v1/embeddings", [
                    "model" => "mixedbread-ai/mxbai-embed-large-v1",
                    "input" => $text,
                    "normalized" => true
                ]);

            if ($response->failed()) return "";

            $vector = $response->json()['data'][0]['embedding'] ?? null;
            
            if (!$vector) return "";

            $results = DB::connection('mongodb')
                ->table('nutrition_tips')
                ->raw(function ($collection) use ($vector) {
                    return $collection->aggregate([
                        [
                            '$vectorSearch' => [
                                'index' => 'vector_index',
                                'path' => 'embedding',
                                'queryVector' => $vector,
                                'numCandidates' => 10,
                                'limit' => 2
                            ]
                        ]
                    ]);
                });

            $tips = "";
            foreach ($results as $res) {
                $content = is_array($res) ? ($res['content'] ?? '') : ($res->content ?? '');
                if ($content) $tips .= "- " . $content . "\n";
            }

            return $tips;
        } catch (\Exception $e) {
            Log::warning("Vector Search Bypass: " . $e->getMessage());
            return "";
        }
    }

    private function callGeminiApi($userInput, $systemContext, $history)
    {
        $apiKey = env('GEMINI_API_KEY');
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={$apiKey}";

        $contents = [
            ['role' => 'user', 'parts' => [['text' => $systemContext]]],
            ['role' => 'model', 'parts' => [['text' => "Understood. Plain text coach mode active."]]]
        ];

        foreach ($history as $chat) {
            $contents[] = ['role' => 'user', 'parts' => [['text' => $chat->message]]];
            $contents[] = ['role' => 'model', 'parts' => [['text' => $chat->reply]]];
        }

        $contents[] = ['role' => 'user', 'parts' => [['text' => $userInput]]];

        $response = Http::timeout(90)->post($url, ['contents' => $contents]);

        if ($response->successful()) {
            $rawReply = $response->json()['candidates'][0]['content']['parts'][0]['text'];

            // remove markdown
            return trim(preg_replace('/[*#_~`]/', '', $rawReply));
        }

        throw new \Exception("Gemini API Error: " . $response->body());
    }

    private function prepareContext($user, $nutritionContext = "")
    {
        $health = "User Info: Age {$user->age}, Gender {$user->gender}, BMI {$user->current_bmi}, Weight {$user->weight}kg.";

        $plan = DB::table('user_plans')
            ->join('exercise_plans', 'user_plans.plan_id', '=', 'exercise_plans.id')
            ->where('user_plans.user_id', $user->id)
            ->where('user_plans.status', 'active')
            ->select('exercise_plans.name', 'exercise_plans.difficulty_level')
            ->first();

        $planInfo = $plan
            ? "Currently following: {$plan->name} ({$plan->difficulty_level})."
            : "No active plan.";

        $extra = $nutritionContext ? "\nTips: " . $nutritionContext : "";

        return "You are a Professional Fitness Coach.
        STRICT RULES:
        1. Use ONLY PLAIN TEXT.
        2. No bold, no symbols.
        3. Short and friendly.
        4. Talk like a coach.

        Context:
        {$health}
        {$planInfo}
        {$extra}";
    }

    public function getHistory()
    {
        $userId = Auth::id() ?? 1;

        return ChatMessage::where('user_id', $userId)
            ->orderBy('created_at', 'asc')
            ->get();
    }
}
