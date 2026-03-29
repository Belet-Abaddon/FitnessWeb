<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = ['name', 'email', 'password', 'age', 'gender', 'height', 'weight', 'current_bmi', 'role'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    // Get all BMI history
    public function bmiRecords(): HasMany
    {
        return $this->hasMany(BmiRecord::class)->latest();
    }

    // Get the current active plan
    public function activePlan(): HasOne
    {
        return $this->hasOne(UserPlan::class)->where('status', 'active');
    }

    // Get all exercise logs
    public function exerciseLogs(): HasMany
    {
        return $this->hasMany(UserExerciseLog::class);
    }

    public function userPlans()
    {
        return $this->hasMany(UserPlan::class);
    }
    public function chatMessages()
    {
        return $this->hasMany(ChatMessage::class);
    }
}
