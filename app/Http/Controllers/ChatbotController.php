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
            $context = $this->prepareContext($user);
            
            $history = ChatMessage::where('user_id', $user->id)
                        ->latest()->take(5)->get()->reverse();

            $reply = $this->callGeminiApi($userInput, $context, $history);

            $chat = new ChatMessage();
            $chat->user_id = $user->id;
            $chat->message = $userInput;
            $chat->reply = $reply;
            $chat->save();

            return response()->json(['reply' => $reply]);

        } catch (\Exception $e) {
            Log::error("Chatbot Error: " . $e->getMessage());
            return response()->json([
                'reply' => 'I am having trouble connecting. Check your internet!',
                'error_detail' => $e->getMessage() 
            ], 500);
        }
    }

    private function callGeminiApi($userInput, $systemContext, $history)
    {
        $apiKey = env('GEMINI_API_KEY');
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={$apiKey}";

        $contents = [
            ['role' => 'user', 'parts' => [['text' => $systemContext]]],
            ['role' => 'model', 'parts' => [['text' => "Understood. I will provide plain text responses only."]]]
        ];

        foreach ($history as $chat) {
            $contents[] = ['role' => 'user', 'parts' => [['text' => $chat->message]]];
            $contents[] = ['role' => 'model', 'parts' => [['text' => $chat->reply]]];
        }

        $contents[] = ['role' => 'user', 'parts' => [['text' => $userInput]]];

        $response = Http::timeout(90)->post($url, ['contents' => $contents]);

        if ($response->successful()) {
            $rawReply = $response->json()['candidates'][0]['content']['parts'][0]['text'];

            $cleanReply = preg_replace('/[*#_~`]/', '', $rawReply);
            
            return trim($cleanReply);
        }

        throw new \Exception("Gemini API Error: " . $response->body());
    }

    private function prepareContext($user)
    {
        $health = "User Info: Age {$user->age}, Gender {$user->gender}, BMI {$user->current_bmi}, Weight {$user->weight}kg.";
        
        $plan = DB::table('user_plans')
            ->join('exercise_plans', 'user_plans.plan_id', '=', 'exercise_plans.id')
            ->where('user_plans.user_id', $user->id)
            ->where('user_plans.status', 'active')
            ->select('exercise_plans.name', 'exercise_plans.difficulty_level')
            ->first();

        $planInfo = $plan ? "Currently following: {$plan->name} ({$plan->difficulty_level} level)." : "Not enrolled in a plan.";

        return "You are a Professional Fitness Coach. 
                STRICT RULES:
                1. Use ONLY PLAIN TEXT. 
                2. NO BOLD (**), NO HEADERS (#), NO BULLETS (*). 
                3. Use simple new lines for spacing.
                4. Answer ONLY fitness/health topics.
                Context: {$health} {$planInfo}";
    }

    public function getHistory()
    {
        $userId = Auth::id() ?? 1; 

        return ChatMessage::where('user_id', $userId)
                ->orderBy('created_at', 'asc')
                ->get();
    }
}