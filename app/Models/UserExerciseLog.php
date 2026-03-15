<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserExerciseLog extends Model
{
    protected $fillable = ['user_id', 'exercise_id', 'user_plan_id', 'weight_at_time', 'calories_burned'];

    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }
}
