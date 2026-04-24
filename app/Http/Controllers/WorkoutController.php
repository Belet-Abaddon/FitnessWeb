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

        $userCategory =
            $user->current_bmi >= 30 ? 'Obese Class I'
            : ($user->current_bmi >= 25 ? 'Overweight'
                : 'Normal weight');

        $workoutPlans = ExercisePlan::with(['exercises' => function ($query) {
            $query->orderBy('day_number', 'asc');
        }])
            ->where('status', 'published')
            ->get()
            ->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'name' => $plan->name ?? '',
                    'category' => $plan->min_bmi_category ?? 'General',
                    'duration' => ($plan->total_days ?? 0) . " Days",
                    'description' => $plan->description ?? '',
                    'longDescription' => $plan->description ?? '',
                    'est_calories' => $plan->est_calories ?? 300,
                    'target_weight' => ($plan->target_weight_loss ?? 0) . " kg",
                    'level' => $plan->difficulty_level ?? 'Beginner',
                    'daily_minutes' => "30 min",
                    'exercises_by_day' => $plan->exercises
                        ->groupBy('pivot.day_number')
                        ->map(function ($dayGroup, $day) {
                            return [
                                'day' => $day,
                                'exercises' => $dayGroup->map(function ($ex) {
                                    return [
                                        'title' => $ex->title ?? '',
                                        'duration' => $ex->pivot->duration_minutes ?? 0
                                    ];
                                })->values()->toArray()
                            ];
                        })->values()->toArray(),
                ];
            });

        $activePivot = UserPlan::where('user_id', $user->id)
            ->where('status', 'active')
            ->with('plan')
            ->first();

        $currentUserPlan = null;

        if ($activePivot && $activePivot->plan) {
            $plan = $activePivot->plan;
            $totalDays = (int) $plan->total_days;

            $startDate = Carbon::parse($activePivot->start_date)->startOfDay();
            $today = Carbon::now()->startOfDay();
            $currentDayOfPlan = $startDate->diffInDays($today) + 1;

            $completedDays = UserExerciseLog::where('user_plan_id', $activePivot->id)
                ->join('plan_exercises', function ($join) use ($activePivot) {
                    $join->on('user_exercise_logs.exercise_id', '=', 'plan_exercises.exercise_id')
                        ->where('plan_exercises.plan_id', '=', $activePivot->plan_id);
                })
                ->whereDate('user_exercise_logs.created_at', '>=', $activePivot->start_date)
                ->where('plan_exercises.day_number', '<=', $currentDayOfPlan)
                ->distinct('plan_exercises.day_number')
                ->count('plan_exercises.day_number');

            $progress = $totalDays > 0 ? round(($completedDays / $totalDays) * 100) : 0;

            $currentUserPlan = [
                'name' => $plan->name ?? 'No Active Plan Selected',
                'progress' => min($progress, 100),
                'startDate' => Carbon::parse($activePivot->start_date)->format('M d, Y'),
                'endDate' => Carbon::parse($activePivot->start_date)->addDays($totalDays)->format('M d, Y'),
                'completedWorkouts' => $completedDays,
                'totalWorkouts' => $totalDays,
                'nextWorkout' => "Day " . ($completedDays + 1),
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
