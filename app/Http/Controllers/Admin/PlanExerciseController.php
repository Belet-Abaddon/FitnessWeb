<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Models\ExercisePlan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PlanExerciseController extends Controller
{
    public function show($id)
    {
        $plan = ExercisePlan::findOrFail($id);
        
        // We MUST use withPivot('id') so we can delete specific rows later
        $assignedExercises = $plan->exercises()
            ->withPivot('id', 'duration_minutes', 'day_number')
            ->orderBy('plan_exercises.day_number', 'asc')
            ->get();

        // Fixed: changed 'name' to 'title' to match your schema
        $allExercises = Exercise::orderBy('title')->get(); 

        return Inertia::render('Admin/ManageExercises', [
            'plan' => $plan,
            'allExercises' => $allExercises,
            'assignedExercises' => $assignedExercises
        ]);
    }

    public function store(Request $request, $planId)
    {
        $validated = $request->validate([
            'exercise_id' => 'required|exists:exercises,id',
            'duration_minutes' => 'required|integer|min:1',
            'day_number' => 'required|integer|min:1',
        ]);

        $plan = ExercisePlan::findOrFail($planId);
        
        $plan->exercises()->attach($validated['exercise_id'], [
            'duration_minutes' => $validated['duration_minutes'],
            'day_number' => $validated['day_number']
        ]);

        return back()->with('success', 'Exercise added.');
    }

    public function destroy($planId, $pivotId)
    {
        // Now that we passed the pivot ID to the frontend, we can target it specifically
        DB::table('plan_exercises')->where('id', $pivotId)->delete();
        
        return back()->with('success', 'Exercise removed.');
    }
}