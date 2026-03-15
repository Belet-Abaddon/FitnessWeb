<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserPlan;
use Inertia\Inertia;
use Carbon\Carbon;

class UserPlanController extends Controller
{
    public function index()
    {
        $userPlans = UserPlan::with(['user', 'plan', 'logs'])
            ->latest()
            ->get()
            ->map(function ($up) {
                // Timeline Calculations
                $startDate = Carbon::parse($up->start_date);
                $totalDays = $up->plan->total_days ?? 30;
                $endDate = $startDate->copy()->addDays($totalDays);
                $daysRemaining = now()->diffInDays($endDate, false);

                // Weight & BMI Calculations
                $latestLog = $up->logs->sortByDesc('created_at')->first();
                $currentWeight = $latestLog ? $latestLog->weight_at_time : $up->user->weight;
                $weightLoss = $up->user->weight - $currentWeight;
                
                // Target Weight Calculation (Assumes target_weight_loss is in the plan)
                $targetWeight = $up->user->weight - ($up->plan->target_weight_loss ?? 5);

                // Adherence & Progress
                $logsCount = $up->logs->count();
                $daysPassed = max(1, $startDate->diffInDays(now()));
                $adherence = min(100, round(($logsCount / $daysPassed) * 100));
                $progress = $up->status === 'completed' ? 100 : min(99, round(($daysPassed / $totalDays) * 100));

                return [
                    'id' => $up->id,
                    'user_id' => $up->user_id,
                    'user_name' => $up->user->name,
                    'user_email' => $up->user->email,
                    'user_bmi' => $up->user->current_bmi,
                    'plan_id' => $up->plan_id,
                    'plan_name' => $up->plan->name,
                    'plan_duration_weeks' => round($totalDays / 7),
                    'plan_difficulty' => $up->plan->difficulty_level,
                    'start_date' => $up->start_date,
                    'end_date' => $endDate->toDateString(),
                    'start_bmi' => $up->start_bmi,
                    'end_bmi' => $latestLog ? round($latestLog->weight_at_time / (($up->user->height/100)**2), 1) : null,
                    'current_weight' => $currentWeight,
                    'target_weight' => $targetWeight,
                    'status' => $up->status,
                    'progress' => max(0, $progress),
                    'days_remaining' => max(0, $daysRemaining),
                    'weight_loss' => round($weightLoss, 1),
                    'adherence_rate' => $adherence,
                    'last_checkin' => $latestLog ? $latestLog->created_at->toDateString() : 'No check-in',
                ];
            });

        return Inertia::render('Admin/UserPlans', [
            'dbUserPlans' => $userPlans,
            'exercisePlans' => \App\Models\ExercisePlan::all(['id', 'name', 'total_days', 'difficulty_level']),
        ]);
    }
}