<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPlan extends Model
{
    protected $fillable = ['user_id', 'plan_id', 'start_date', 'start_bmi', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plan()
    {
        return $this->belongsTo(ExercisePlan::class);
    }

    // Link logs to this specific enrollment
    public function logs()
    {
        return $this->hasMany(UserExerciseLog::class);
    }
}
