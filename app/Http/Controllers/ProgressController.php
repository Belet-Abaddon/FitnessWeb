<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\BmiRecord;
use App\Models\UserPlan;
use App\Models\UserExerciseLog;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ProgressController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // 1. Fetch Base Data
        $firstBmi = BmiRecord::where('user_id', $user->id)->oldest()->first();
        $latestBmi = BmiRecord::where('user_id', $user->id)->latest()->first();
        $activeUserPlan = UserPlan::where('user_id', $user->id)
            ->where('status', 'active')
            ->with('plan')
            ->first();

        // 2. Calculate Shared Metrics
        $currentWeight = $latestBmi ? $latestBmi->weight : $user->weight;
        $startingWeight = $firstBmi ? $firstBmi->weight : $user->weight;
        $totalWorkouts = UserExerciseLog::where('user_id', $user->id)->count();
        $currentStreak = $this->calculateStreak($user->id);

        return Inertia::render('Progress', [
            'stats' => $this->formatStats($user, $firstBmi, $latestBmi, $activeUserPlan, $totalWorkouts, $currentStreak),
            'weightHistory' => $this->getWeightHistory($user->id),
            'userPlans' => $this->getUserPlans($user->id),
            'weeklyWorkouts' => $this->getWeeklyActivity($user->id),
            'achievements' => $this->getAchievements($user->id, $startingWeight, $currentWeight, $totalWorkouts, $currentStreak)
        ]);
    }

    /**
     * Formats the primary statistics for the top cards
     */
    private function formatStats($user, $firstBmi, $latestBmi, $activeUserPlan, $totalWorkouts, $streak)
    {
        $currentWeight = $latestBmi ? $latestBmi->weight : $user->weight;
        $startingWeight = $firstBmi ? $firstBmi->weight : $user->weight;

        $targetWeight = $activeUserPlan
            ? ($startingWeight - $activeUserPlan->plan->target_weight_loss)
            : ($startingWeight - 5);

        return [
            'name' => $user->name,
            'joinDate' => $user->created_at->format('F d, Y'),
            // FIX: Ensure this is a whole number (integer)
            'totalDays' => (int) $user->created_at->diffInDays(now()),
            'currentWeight' => (float)$currentWeight,
            'startingWeight' => (float)$startingWeight,
            'goalWeight' => (float)$targetWeight,
            'currentBMI' => (float)($latestBmi->bmi_value ?? $user->current_bmi),
            'startingBMI' => (float)($firstBmi->bmi_value ?? $user->current_bmi),
            'workoutsCompleted' => $totalWorkouts,
            'currentStreak' => (int)$streak,
        ];
    }

    /**
     * Retrieves weight logs for the table and line graph
     */
    private function getWeightHistory($userId)
    {
        return BmiRecord::where('user_id', $userId)
            ->latest()
            ->take(10)
            ->get()
            ->map(fn($record) => [
                'date' => $record->created_at->format('M d, Y'),
                'weight' => (float)$record->weight,
                'bmi' => (float)$record->bmi_value,
                'note' => $record->bmi_category
            ]);
    }

    /**
     * Retrieves all plans the user has interacted with
     */
    private function getUserPlans($userId)
    {
        return UserPlan::where('user_id', $userId)
            ->with(['plan' => fn($q) => $q->withCount('exercises')])
            ->latest()
            ->get()
            ->map(function ($up) {
                $completedCount = UserExerciseLog::where('user_plan_id', $up->id)
                    ->distinct('exercise_id')
                    ->count();
                $totalInPlan = $up->plan->exercises_count;

                return [
                    'id' => $up->id,
                    'name' => $up->plan->name,
                    'startDate' => Carbon::parse($up->start_date)->format('M d, Y'),
                    'endDate' => Carbon::parse($up->start_date)->addDays($up->plan->total_days)->format('M d, Y'),
                    'status' => $up->status,
                    'progress' => $totalInPlan > 0 ? round(($completedCount / $totalInPlan) * 100) : 0,
                    'workoutsCompleted' => $completedCount,
                    'totalWorkouts' => $totalInPlan,
                ];
            });
    }

    /**
     * Logic for the bar chart activity
     */
    private function getWeeklyActivity($userId)
    {
        return collect(range(0, 7))->map(function ($weeksAgo) use ($userId) {
            $start = Carbon::now()->subWeeks($weeksAgo)->startOfWeek();
            $end = Carbon::now()->subWeeks($weeksAgo)->endOfWeek();

            return [
                'week' => $weeksAgo == 0 ? 'This Week' : 'Week ' . (8 - $weeksAgo),
                'count' => UserExerciseLog::where('user_id', $userId)
                    ->whereBetween('created_at', [$start, $end])
                    ->count()
            ];
        })->reverse()->values();
    }

    /**
     * Generates achievement badges based on user performance
     */
    private function getAchievements($userId, $startWeight, $currWeight, $totalWorkouts, $streak)
    {
        $weightLost = $startWeight - $currWeight;
        $hasFinishedPlan = UserPlan::where('user_id', $userId)->where('status', 'completed')->exists();

        return [
            ['id' => 1, 'name' => 'First Step', 'description' => 'Complete your first exercise', 'unlocked' => $totalWorkouts > 0, 'icon' => '🎯'],
            ['id' => 2, 'name' => 'Weight Warrior', 'description' => 'Lose 5kg total', 'unlocked' => $weightLost >= 5, 'icon' => '🏆'],
            ['id' => 3, 'name' => 'Consistency', 'description' => '7 Day Streak', 'unlocked' => $streak >= 7, 'icon' => '🔥'],
            ['id' => 4, 'name' => 'Goal Getter', 'description' => 'Complete a plan', 'unlocked' => $hasFinishedPlan, 'icon' => '🌟'],
        ];
    }

    /**
     * Helper: Calculates current consecutive days of activity
     */
    private function calculateStreak($userId)
    {
        $dates = UserExerciseLog::where('user_id', $userId)
            ->selectRaw('DATE(created_at) as date')
            ->distinct()
            ->orderBy('date', 'desc')
            ->pluck('date');

        if ($dates->isEmpty()) return 0;

        $streak = 0;
        $compareDate = Carbon::today();

        foreach ($dates as $date) {
            $logDate = Carbon::parse($date);
            if ($logDate->eq($compareDate)) {
                $streak++;
                $compareDate->subDay();
            } elseif ($logDate->lt($compareDate)) {
                break;
            }
        }
        return $streak;
    }
}
