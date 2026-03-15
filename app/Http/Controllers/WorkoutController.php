<?php

namespace App\Http\Controllers;

use App\Models\ExercisePlan;
use App\Models\UserPlan;
use App\Models\BmiRecord;
use App\Models\UserExerciseLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class WorkoutController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // 1. Determine BMI Category
        $userCategory = $user->current_bmi >= 30 ? 'Obese' : ($user->current_bmi >= 25 ? 'Overweight' : 'Normal');

        // 2. Fetch Plans with Day-grouped Exercises
        $workoutPlans = ExercisePlan::with(['exercises' => function ($query) {
            $query->orderBy('day_number', 'asc');
        }])
            ->where('status', 'published')
            ->get()
            ->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'category' => $plan->min_bmi_category,
                    'duration' => $plan->total_days . " Days",
                    'description' => $plan->description,
                    'longDescription' => $plan->description,
                    'est_calories' => 300,
                    'target_weight' => $plan->target_weight_loss . " kg",
                    'level' => $plan->difficulty_level,
                    'daily_minutes' => "30 min",
                    // Grouping exercises by day for the modal
                    'exercises_by_day' => $plan->exercises->groupBy('pivot.day_number')
                        ->map(function ($dayGroup, $day) {
                            return [
                                'day' => $day,
                                'exercises' => $dayGroup->map(fn($ex) => [
                                    'title' => $ex->title,
                                    'duration' => $ex->pivot->duration_minutes
                                ])
                            ];
                        })->values()->toArray(),
                    // Keep the simple list for the card view if needed
                    'exercises' => $plan->exercises->pluck('title')->unique()->values()->toArray(),
                ];
            });

        // 3. Get Active Plan & Progress
        $activePivot = UserPlan::where('user_id', $user->id)
            ->where('status', 'active')
            ->with('plan')
            ->first();

        $currentUserPlan = null;
        if ($activePivot) {
            $totalDays = $activePivot->plan->total_days;
            $completedCount = UserExerciseLog::where('user_plan_id', $activePivot->id)
                ->join('plan_exercises', 'user_exercise_logs.exercise_id', '=', 'plan_exercises.exercise_id')
                ->distinct('plan_exercises.day_number')
                ->count('plan_exercises.day_number');

            $currentUserPlan = [
                'name' => $activePivot->plan->name,
                'progress' => ($totalDays > 0) ? round(($completedCount / $totalDays) * 100) : 0,
                'startDate' => Carbon::parse($activePivot->start_date)->format('M d, Y'),
                'endDate' => Carbon::parse($activePivot->start_date)->addDays($totalDays)->format('M d, Y'),
                'completedWorkouts' => $completedCount,
                'totalWorkouts' => $totalDays,
                'nextWorkout' => "Day " . ($completedCount + 1),
            ];
        }

        return Inertia::render('Workouts', [
            'workoutPlans' => $workoutPlans,
            'currentUserPlan' => $currentUserPlan,
            'userBmiCategory' => $userCategory,
        ]);
    }

    public function join(Request $request)
    {
        $request->validate(['plan_id' => 'required|exists:exercise_plans,id']);
        $user = Auth::user();

        // Deactivate previous plans
        UserPlan::where('user_id', $user->id)->update(['status' => 'cancelled']);

        // Join new plan
        UserPlan::create([
            'user_id' => $user->id,
            'plan_id' => $request->plan_id,
            'start_date' => now(),
            'start_bmi' => $user->current_bmi ?? 0,
            'status' => 'active',
        ]);

        return redirect()->back()->with('message', 'Plan activated successfully!');
    }
}
