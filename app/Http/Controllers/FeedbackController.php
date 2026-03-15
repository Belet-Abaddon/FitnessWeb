<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    /**
     * ADMIN: List all feedback and stats
     */
    public function index(Request $request)
    {
        $query = Feedback::with('user:id,name');

        // Search Filter
        if ($request->search) {
            $query->where('comment', 'like', '%' . $request->search . '%')
                ->orWhereHas('user', function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%');
                });
        }

        // Stats Calculation
        $totalFeedback = Feedback::count();
        $lastMonth = Feedback::where('created_at', '<', Carbon::now()->subMonth())->count();
        $trend = $lastMonth > 0 ? round((($totalFeedback - $lastMonth) / $lastMonth) * 100) : 0;

        return Inertia::render('Feedback', [
            'feedbacks' => $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString(),
            'stats' => [
                'total' => $totalFeedback,
                'trend' => ($trend >= 0 ? '+' : '') . $trend . '%',
                'new' => Feedback::where('status', 'pending')->count(),
                'avgRating' => round(Feedback::avg('rating') ?? 0, 1),
                'resolved' => $totalFeedback > 0
                    ? round((Feedback::where('status', 'resolved')->count() / $totalFeedback) * 100) . '%'
                    : '0%',
            ],
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * USER: Show feedback form and history
     */
    public function userIndex()
    {
        return Inertia::render('Feedback', [
            'previousFeedback' => Feedback::where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get()
        ]);
    }

    /**
     * USER: Submit new feedback
     */
    public function store(Request $request)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:5',
        ]);

        Feedback::create([
            'user_id' => Auth::id(),
            'rating' => $request->rating,
            'comment' => $request->comment,
            'status' => 'active',
            'priority' => $request->rating <= 2 ? 'high' : 'medium',
        ]);

        return back()->with('success', 'Thank you for your feedback!');
    }

    /**
     * ADMIN: Update status or priority
     */
    public function update(Request $request, $id)
    {
        $feedback = Feedback::findOrFail($id);
        $feedback->update($request->only('status', 'priority'));

        return back()->with('success', 'Feedback updated');
    }

    /**
     * ADMIN/USER: Delete feedback
     */
    public function destroy($id)
    {
        $feedback = Feedback::findOrFail($id);

        if (Auth::user()->is_admin || $feedback->user_id === Auth::id()) {
            $feedback->delete();

            // Use the specific route name to ensure you stay on the feedback page
            return redirect()->route('user.feedback.index')->with('success', 'Feedback removed');
        }

        abort(403);
    }
}
