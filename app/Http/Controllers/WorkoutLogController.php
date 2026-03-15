<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserExerciseLog;
use App\Models\UserPlan;
use App\Models\BmiRecord;
use Illuminate\Support\Facades\Auth;

class WorkoutLogController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'exercise_id' => 'required|exists:exercises,id',
            'duration' => 'required|numeric',
            'calories' => 'required|numeric',
        ]);

        $user = Auth::user();
        
        // Find the active plan
        $activePlan = UserPlan::where('user_id', $user->id)
            ->where('status', 'active')
            ->first();

        // Get the most recent weight
        $latestBmi = BmiRecord::where('user_id', $user->id)->latest()->first();
        $currentWeight = $latestBmi ? $latestBmi->weight : $user->weight;

        UserExerciseLog::create([
            'user_id' => $user->id,
            'exercise_id' => $request->exercise_id,
            'user_plan_id' => $activePlan->id,
            'weight_at_time' => $currentWeight,
            'calories_burned' => $request->calories,
        ]);

        return redirect()->back()->with('success', 'Exercise logged successfully!');
    }
}