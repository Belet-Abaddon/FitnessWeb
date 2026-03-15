<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Exercise;
use App\Models\UserPlan;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $thirtyDaysAgo = $now->copy()->subDays(30);

        // 1. Basic Stats (Confirmed Tables)
        $totalActiveUsers = UserPlan::where('status', 'active')->distinct('user_id')->count();
        $safeExercises = Exercise::where('met_value', '<', 4.0)->count();
        $avgBurned = DB::table('user_exercise_logs')->avg('calories_burned') ?? 0;

        // 2. Calculated Health Metrics (Derived from Logs)
        // Compliance: Ratio of users who logged at least 3 workouts this week vs total active users
        $consistentUsers = DB::table('user_exercise_logs')
            ->where('created_at', '>=', $now->copy()->startOfWeek())
            ->select('user_id', DB::raw('count(*) as total'))
            ->groupBy('user_id')
            ->having('total', '>=', 3)
            ->get()
            ->count();
        $complianceRate = $totalActiveUsers > 0 ? round(($consistentUsers / $totalActiveUsers) * 100) : 0;

        // 3. Safety Metrics (Calculated from MET values and BMI Categories)
        $totalLogs = DB::table('user_exercise_logs')->count() ?: 1;
        $highStrainAlerts = DB::table('user_exercise_logs')
            ->join('exercises', 'user_exercise_logs.exercise_id', '=', 'exercises.id')
            ->join('bmi_records', 'user_exercise_logs.user_id', '=', 'bmi_records.user_id')
            ->where('exercises.met_value', '>', 7.0) // High intensity
            ->where('bmi_records.bmi_category', 'like', '%Obese%')
            ->count();
        $alertRate = number_format(($highStrainAlerts / $totalLogs) * 100, 1);

        // 4. Weight Loss Progress (Comparison of First and Last BMI Record per user)
        $totalWeightLost = DB::table('users')
            ->join('bmi_records as first_bmi', function($join) {
                $join->on('users.id', '=', 'first_bmi.user_id')
                     ->whereRaw('first_bmi.created_at = (SELECT MIN(created_at) FROM bmi_records b2 WHERE b2.user_id = users.id)');
            })
            ->join('bmi_records as last_bmi', function($join) {
                $join->on('users.id', '=', 'last_bmi.user_id')
                     ->whereRaw('last_bmi.created_at = (SELECT MAX(created_at) FROM bmi_records b3 WHERE b3.user_id = users.id)');
            })
            // Assumes column is 'weight' - replace with 'weight_at_time' if necessary
            ->select(DB::raw('SUM(first_bmi.weight - last_bmi.weight) as total_loss'))
            ->first()->total_loss ?? 0;

        // 5. Assemble Final Data Object
        $dashboardData = [
            'stats' => [
                ['title' => 'Active Users', 'value' => number_format($totalActiveUsers), 'change' => 'Total', 'changeType' => 'increase', 'icon' => 'Users', 'color' => 'bg-blue-500', 'trend' => 'up', 'description' => 'Users with active plans'],
                ['title' => 'Safe Exercises', 'value' => $safeExercises, 'change' => 'MET < 4.0', 'changeType' => 'increase', 'icon' => 'Shield', 'color' => 'bg-green-500', 'trend' => 'up', 'description' => 'Low-impact movements'],
                ['title' => 'Avg Burned', 'value' => round($avgBurned) . ' kcal', 'change' => 'Avg', 'changeType' => 'increase', 'icon' => 'Flame', 'color' => 'bg-orange-500', 'trend' => 'up', 'description' => 'Calories per session'],
                ['title' => 'Health Logs', 'value' => DB::table('bmi_records')->count(), 'change' => 'Total', 'changeType' => 'increase', 'icon' => 'Scale', 'color' => 'bg-purple-500', 'trend' => 'up', 'description' => 'Total weight/BMI records']
            ],
            'recentActivities' => $this->getRecentActivities(),
            'bmiDistribution' => $this->getBmiDistribution(),
            'healthMetrics' => [
                ['label' => 'Weekly Consistency', 'value' => $consistentUsers . ' Users', 'change' => '3+ logs/week', 'improvement' => true, 'icon' => 'UserCheck'],
                ['label' => 'Plan Compliance', 'value' => $complianceRate . '%', 'change' => 'Active users', 'improvement' => $complianceRate > 50, 'icon' => 'ClipboardCheck'],
            ],
            'recentUsers' => $this->getRecentUsers(),
            'safetyMetrics' => [
                ['metric' => 'Low Impact Availability', 'target' => '> 50%', 'value' => round(($safeExercises / (Exercise::count() ?: 1)) * 100) . '%', 'status' => 'good'],
                ['metric' => 'High Strain Alerts', 'target' => '< 5%', 'value' => $alertRate . '%', 'status' => $alertRate < 5 ? 'good' : 'warning'],
            ],
            'weightLossProgress' => [
                'avgMonthlyLoss' => number_format($totalWeightLost / (User::count() ?: 1), 1),
                'successRate' => $complianceRate,
                'totalWeightLost' => number_format(max(0, $totalWeightLost), 1)
            ],
            'exerciseCategories' => [
                ['name' => 'Low Impact', 'count' => $safeExercises, 'color' => 'blue', 'icon' => 'Shield', 'description' => 'MET < 4.0'],
                ['name' => 'Strength', 'count' => Exercise::where('title', 'like', '%Strength%')->orWhere('title', 'like', '%Weight%')->count(), 'color' => 'purple', 'icon' => 'Dumbbell', 'description' => 'Resistance'],
                ['name' => 'Cardio', 'count' => Exercise::where('title', 'like', '%Cardio%')->orWhere('title', 'like', '%Run%')->count(), 'color' => 'green', 'icon' => 'Activity', 'description' => 'Aerobic'],
                ['name' => 'Flexibility', 'count' => Exercise::where('title', 'like', '%Yoga%')->orWhere('title', 'like', '%Stretch%')->count(), 'color' => 'yellow', 'icon' => 'Target', 'description' => 'Mobility'],
            ]
        ];

        return Inertia::render('Admin/Dashboard', ['initialData' => $dashboardData]);
    }

    private function getRecentActivities()
    {
        return DB::table('user_exercise_logs')
            ->join('users', 'user_exercise_logs.user_id', '=', 'users.id')
            ->join('exercises', 'user_exercise_logs.exercise_id', '=', 'exercises.id')
            ->leftJoin('bmi_records', function($join) {
                $join->on('users.id', '=', 'bmi_records.user_id')
                     ->whereRaw('bmi_records.created_at = (SELECT MAX(created_at) FROM bmi_records b2 WHERE b2.user_id = users.id)');
            })
            ->select('users.name as user', 'exercises.title as exercise', 'user_exercise_logs.calories_burned', 'user_exercise_logs.created_at', 'bmi_records.bmi_category')
            ->orderBy('user_exercise_logs.created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($a) => [
                'id' => uniqid(),
                'user' => $a->user,
                'action' => "completed {$a->exercise} (" . round($a->calories_burned) . " kcal)",
                'bmiCategory' => str_contains(strtolower($a->bmi_category ?? ''), 'obese') ? 'obese' : 'overweight',
                'time' => Carbon::parse($a->created_at)->diffForHumans(),
                'icon' => 'Activity',
                'color' => 'bg-blue-100 text-blue-600'
            ]);
    }

    private function getBmiDistribution()
    {
        $distribution = DB::table('bmi_records as br1')
            ->whereRaw('br1.created_at = (SELECT MAX(created_at) FROM bmi_records br2 WHERE br2.user_id = br1.user_id)')
            ->select('bmi_category', DB::raw('count(*) as count'))
            ->groupBy('bmi_category')
            ->get();
        
        $total = $distribution->sum('count') ?: 1;

        return $distribution->map(fn($item) => [
            'category' => ucfirst(str_replace('_', ' ', $item->bmi_category ?? 'Unknown')),
            'count' => $item->count,
            'percentage' => round(($item->count / $total) * 100),
            'color' => str_contains(strtolower($item->bmi_category ?? ''), 'obese') ? 'bg-red-500' : 'bg-blue-500',
            'description' => 'Active tracking'
        ]);
    }

    private function getRecentUsers()
    {
        return User::leftJoin('bmi_records', function($join) {
                $join->on('users.id', '=', 'bmi_records.user_id')
                     ->whereRaw('bmi_records.created_at = (SELECT MAX(created_at) FROM bmi_records b2 WHERE b2.user_id = users.id)');
            })
            ->select('users.name', 'bmi_records.bmi_category', 'users.created_at')
            ->orderBy('users.created_at', 'desc')
            ->limit(4)
            ->get()
            ->map(fn($u) => [
                'name' => $u->name,
                'bmi' => '--',
                'category' => ucfirst(str_replace('_', ' ', $u->bmi_category ?? 'Pending')),
                'plan' => 'Custom Weight Loss',
                'risk' => str_contains(strtolower($u->bmi_category ?? ''), 'obese') ? 'High' : 'Moderate'
            ]);
    }
}