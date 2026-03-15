<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Feedback extends Model
{
    use HasFactory;

    // Use protected $table if your table name is not 'feedbacks' (plural)
    // but since we named the migration 'feedback', we specify it here:
    protected $table = 'feedback';

    protected $fillable = [
        'user_id',
        'rating',
        'comment',
        'status',
        'priority',
    ];

    /**
     * Get the user that authored the feedback.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}