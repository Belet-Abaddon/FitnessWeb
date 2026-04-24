<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanExercise extends Model
{
    protected $fillable = ['plan_id', 'exercise_id', 'duration_minutes', 'day_number'];

    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }

    public function plan()
    {
        return $this->belongsTo(ExercisePlan::class);
    }
}
