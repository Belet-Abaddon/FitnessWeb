<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class FeedbackController extends Controller
{
    public function index()
    {
        $query = Feedback::with('user:id,name');

        $totalFeedback = Feedback::count();
        $lastMonthFeedback = Feedback::where('created_at', '<', Carbon::now()->subMonth())->count();

        $trend = 0;
        if ($lastMonthFeedback > 0) {
            $trend = round((($totalFeedback - $lastMonthFeedback) / $lastMonthFeedback) * 100);
        }

        $stats = [
            'total' => $totalFeedback,
            'trend' => ($trend >= 0 ? '+' : '') . $trend . '%',
            'new' => Feedback::where('status', 'pending')->count(),
            'avgRating' => round(Feedback::avg('rating') ?? 0, 1),
            'resolved' => Feedback::count() > 0
                ? round((Feedback::where('status', 'resolved')->count() / Feedback::count()) * 100) . '%'
                : '0%',
        ];

        return Inertia::render('Admin/Feedback', [
            'feedbacks' => $query->orderBy('created_at', 'desc')->paginate(10),
            'stats' => $stats
        ]);
    }
}
