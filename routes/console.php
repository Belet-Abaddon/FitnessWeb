<?php

use App\Models\User;
use App\Mail\DailyMotivationMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    $messages = [
        "Success starts with self-discipline. Keep going!",
        "The only bad workout is the one that didn't happen.",
        "Your body can stand almost anything. It’s your mind that you have to convince.",
        "Fitness is not about being better than someone else. It's about being better than you were yesterday.",
        "Motivation is what gets you started. Habit is what keeps you going.",
        "A one-hour workout is only 4% of your day. No excuses.",
        "Progress, not perfection. Every step counts!",
        "Don't stop when you're tired. Stop when you're done."
    ];

    $users = User::where('is_reminder_on', true)->get();

    foreach ($users as $user) {
        $randomMsg = $messages[array_rand($messages)];
        Mail::to($user->email)->send(new DailyMotivationMail($randomMsg));
    }
})->dailyAt('08:00');