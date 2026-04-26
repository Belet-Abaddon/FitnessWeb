<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\BmiRecord;
use App\Models\UserPlan;
use App\Models\UserExerciseLog;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Fetch data using private helper methods
        $bmiData = $this->getBmiData($user);
        $workoutHistory = $this->getWorkoutHistory($user);
        $todayExercises = $this->getTodayExercises($user);

        // Prepare Stats
        $dbStats = $this->prepareStats($user, $bmiData, $workoutHistory);

        return Inertia::render('Dashboard', [
            'dbUser' => [
                'name' => $user->name,
                'weight' => $bmiData['latest']->weight ?? $user->weight,
                'bmi' => (float)($bmiData['latest']->bmi_value ?? $user->current_bmi ?? 0),
                'bmiCategory' => $bmiData['latest']->bmi_category ?? 'Update Profile',
                'currentPlan' => $todayExercises['planName'] ?? 'No Active Plan',
            ],
            'dbStats' => $dbStats,
            'todayExercises' => $todayExercises['exercises'],
            'bmiHistory' => $bmiData['history'],
            'workoutHistory' => $workoutHistory,
        ]);
    }

    /**
     * Fetch BMI History and latest/first records
     */
    private function getBmiData($user)
    {
        $history = BmiRecord::where('user_id', $user->id)
            ->latest()
            ->take(10)
            ->get();

        return [
            'history' => $history,
            'latest' => $history->first(),
            'first' => BmiRecord::where('user_id', $user->id)->oldest()->first()
        ];
    }

    /**
     * Fetch the full workout log history
     */
    private function getWorkoutHistory($user)
    {
        return UserExerciseLog::where('user_id', $user->id)
            ->with('exercise:id,title')
            ->latest()
            ->get()
            ->map(fn($log) => [
                'id' => $log->id,
                'exercise_title' => $log->exercise->title ?? 'Exercise Deleted',
                'calories' => $log->calories_burned,
                'weight' => $log->weight_at_time,
                'date' => $log->created_at->format('M d, Y'),
                'time' => $log->created_at->format('h:i A'),
            ]);
    }

    /**
     * Calculate exercises assigned for the current day of the plan
     */
    private function getTodayExercises($user)
    {
        $completedTodayIds = UserExerciseLog::where('user_id', $user->id)
            ->whereDate('created_at', Carbon::today())
            ->pluck('exercise_id')
            ->toArray();

        $activePlan = UserPlan::where('user_id', $user->id)
            ->where('status', 'active')
            ->with(['plan.exercises'])
            ->first();

        $exercises = collect();
        $planName = $activePlan->plan->name ?? null;

        if ($activePlan && $activePlan->plan) {
            $startDate = Carbon::parse($activePlan->start_date)->startOfDay();
            $dayNumber = $startDate->diffInDays(now()->startOfDay()) + 1;
            $maxDays = $activePlan->plan->total_days ?? 30;

            if ($dayNumber <= $maxDays) {
                $exercises = $activePlan->plan->exercises
                    ->where('pivot.day_number', $dayNumber)
                    ->map(fn($ex) => [
                        'id' => $ex->id,
                        'title' => $ex->title,
                        'description' => $ex->description,
                        'media_path' => $ex->media_path ? Storage::url($ex->media_path) : null,
                        'duration' => $ex->pivot->duration_minutes . ' min',
                        'calories' => (int)($ex->met_value * $ex->pivot->duration_minutes),
                        'is_completed' => in_array($ex->id, $completedTodayIds),
                    ])->values();
            }
        }

        return [
            'exercises' => $exercises,
            'planName' => $planName
        ];
    }

    /**
     * Compile the summary statistics for the dashboard cards
     */
    private function prepareStats($user, $bmiData, $workoutHistory)
    {
        $latest = $bmiData['latest'];
        $first = $bmiData['first'];

        $weightChange = ($first && $latest) ? $latest->weight - $first->weight : 0;
        $bmiChange = ($first && $latest) ? $latest->bmi_value - $first->bmi_value : 0;

        return [
            ['label' => 'Current Weight', 'value' => ($latest->weight ?? 0) . ' kg', 'change' => number_format(abs($weightChange), 1) . ' kg', 'positive' => $weightChange <= 0],
            ['label' => 'BMI', 'value' => number_format($latest->bmi_value ?? 0, 1), 'change' => number_format(abs($bmiChange), 1), 'positive' => $bmiChange <= 0],
            ['label' => 'Total Workouts', 'value' => (string)$workoutHistory->count(), 'change' => 'Workouts', 'positive' => true],
            ['label' => 'Streak', 'value' => (string)$this->calculateStreak($user->id), 'change' => 'Days', 'positive' => true],
        ];
    }

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

        $latestLogDate = Carbon::parse($dates->first());
        if (!$latestLogDate->isToday() && !$latestLogDate->isYesterday()) {
            return 0;
        }

        if (!$latestLogDate->isToday()) {
            $compareDate = Carbon::yesterday();
        }

        foreach ($dates as $date) {
            $logDate = Carbon::parse($date);

            if ($logDate->eq($compareDate)) {
                $streak++;
                $compareDate->subDay();
            } else {
                break;
            }
        }

        return $streak;
    }
}
