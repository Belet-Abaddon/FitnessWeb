<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    protected $fillable = ['title', 'description', 'met_value', 'media_path'];

    public function plans()
    {
        return $this->belongsToMany(ExercisePlan::class, 'plan_exercises');
    }
}
