<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FitnessKnowledge extends Model
{
    use HasFactory;

    protected $table = 'fitness_knowledge';

    protected $fillable = ['question', 'answer', 'category'];
}
