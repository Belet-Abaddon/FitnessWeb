<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatMessage extends Model
{
    use HasFactory;

    // Mass Assignment လုပ်ခွင့်ပြုမယ့် column များ
    protected $fillable = ['user_id', 'message', 'reply'];

    /**
     * ဒီ message က ဘယ် user ပိုင်တာလဲဆိုတာ ချိတ်ဆက်မှု (Relationship)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}