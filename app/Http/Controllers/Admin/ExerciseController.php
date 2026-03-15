<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Exercise;
use App\Models\ExercisePlan;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ExerciseController extends Controller
{
    public function index(Request $request)
    {
        $query = Exercise::query();

        // Search Filter
        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        return Inertia::render('Admin/Exercises', [
            'exercises' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
            'stats' => [
                'total' => Exercise::count(),
                'avgMet' => round(Exercise::avg('met_value') ?? 0, 1),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'met_value' => 'required|numeric|between:0,99.99',
            'media' => 'nullable|file|mimes:mp4,mov,avi|max:50000', // 50MB Max
        ]);

        if ($request->hasFile('media')) {
            $validated['media_path'] = $request->file('media')->store('exercises', 'public');
        }

        Exercise::create($validated);

        return back()->with('success', 'Exercise created successfully.');
    }

    public function update(Request $request, Exercise $exercise)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'met_value' => 'required|numeric|between:0,99.99',
            'media' => 'nullable|file|mimes:mp4,mov,avi|max:50000',
        ]);

        if ($request->hasFile('media')) {
            // Delete old video if new one is uploaded
            if ($exercise->media_path) {
                Storage::disk('public')->delete($exercise->media_path);
            }
            $validated['media_path'] = $request->file('media')->store('exercises', 'public');
        }

        $exercise->update($validated);

        return back()->with('success', 'Exercise updated successfully.');
    }

    public function destroy(Exercise $exercise)
    {
        if ($exercise->media_path) {
            Storage::disk('public')->delete($exercise->media_path);
        }
        $exercise->delete();

        return back()->with('success', 'Exercise deleted successfully.');
    }
}
