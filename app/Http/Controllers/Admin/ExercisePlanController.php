<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ExercisePlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExercisePlanController extends Controller
{
    public function index(Request $request)
    {
        $query = ExercisePlan::query();

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                ->orWhere('description', 'like', "%{$request->search}%");
        }

        $stats = [
            'total' => ExercisePlan::count(),
            'active' => ExercisePlan::where('status', 'published')->count(), // Match enum: published
            'inactive' => ExercisePlan::where('status', 'unpublished')->count(),    // Match enum: draft
            'totalParticipants' => 0,
        ];

        $bmiCategories = [
            'Underweight',
            'Normal',
            'Overweight',
            'Obese Class I',
            'Obese Class II',
            'Obese Class III'
        ];

        return Inertia::render('Admin/ExercisePlans', [
            'plans' => $query->latest()->get(),
            'stats' => $stats,
            'bmiCategories' => $bmiCategories,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'total_days' => 'required|integer|min:1',
            'target_weight_loss' => 'nullable|numeric',
            'min_bmi_category' => 'required|string',
            'max_bmi_category' => 'required|string',
            'difficulty_level' => 'required|string',
            'status' => 'required|in:published,draft',
        ]);

        ExercisePlan::create($validated);
        return redirect()->back();
    }

    public function update(Request $request, ExercisePlan $exercisePlan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'total_days' => 'required|integer|min:1',
            'target_weight_loss' => 'nullable|numeric',
            'min_bmi_category' => 'required|string',
            'max_bmi_category' => 'required|string',
            'difficulty_level' => 'required|string',
            'status' => 'required|in:published,draft',
        ]);

        $exercisePlan->update($validated);
        return redirect()->back();
    }

    public function destroy(ExercisePlan $exercisePlan)
    {
        // Instead of deleting, we change status to unpublished
        $exercisePlan->update(['status' => 'unpublished']);

        return redirect()->back()->with('message', 'Plan has been unpublished.');
    }
}
