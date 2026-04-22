<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExercisePlan extends Model
{
    protected $fillable = ['name', 'description', 'total_days', 'target_weight_loss', 'min_bmi_category', 'max_bmi_category', 'difficulty_level', 'status'];

    public function exercises()
    {
        return $this->belongsToMany(Exercise::class, 'plan_exercises', 'plan_id', 'exercise_id')
            ->withPivot('id', 'duration_minutes', 'day_number');
    }
}
