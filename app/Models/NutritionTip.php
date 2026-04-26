<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NutritionTip extends Model
{
    use HasFactory;
    protected $table = 'nutrition_tips';
    protected $fillable = [
        'name',
        'content',
    ];
}
