<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\ExercisePlanController;
use App\Http\Controllers\Admin\ExerciseController;
use App\Http\Controllers\Admin\PlanExerciseController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\UserPlanController;
use App\Http\Controllers\Admin\BMIRecordController;
use App\Http\Controllers\WorkoutController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\WorkoutLogController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\FeedbackController as AdminFeedbackController;
use App\Http\Controllers\FeedbackController;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/workouts', [WorkoutController::class, 'index'])->name('workouts.index');
    Route::post('/workouts/join', [WorkoutController::class, 'join'])->name('workouts.join');
    Route::post('/workout-log', [WorkoutLogController::class, 'store'])->name('workout.log');
    Route::get('/progress', [ProgressController::class, 'index'])->name('progress');
    Route::get('/feedback', [FeedbackController::class, 'userIndex'])->name('user.feedback.index');
    Route::post('/feedback', [FeedbackController::class, 'store'])->name('user.feedback.store');
    Route::delete('/feedback/{id}', [FeedbackController::class, 'destroy'])->name('feedback.destroy');
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

    Route::get('exercise-plans/{id}/manage', [PlanExerciseController::class, 'show'])
        ->name('plan-exercises.manage');

    Route::post('exercise-plans/{plan}/exercises', [PlanExerciseController::class, 'store'])
        ->name('plan-exercises.store');

    Route::delete('exercise-plans/{plan}/exercises/{pivotId}', [PlanExerciseController::class, 'destroy'])
        ->name('plan-exercises.destroy');

    Route::resource('exercise-plans', ExercisePlanController::class);

    Route::get('admin/exercises', [ExerciseController::class, 'index'])->name('exercises.index');
    Route::post('admin/exercises', [ExerciseController::class, 'store'])->name('exercises.store');
    Route::post('admin/exercises/{exercise}', [ExerciseController::class, 'update'])->name('exercises.update');
    Route::delete('admin/exercises/{exercise}', [ExerciseController::class, 'destroy'])->name('exercises.destroy');

    Route::get('admin/users', [UserController::class, 'index'])->name('users.index');
    Route::patch('admin/users/{user}/role', [UserController::class, 'updateRole'])->name('users.update-role');

    Route::get('admin/user-plans', [UserPlanController::class, 'index'])->name('user-plans.index');

    Route::get('/admin/bmi-records', [BMIRecordController::class, 'index'])->name('admin.bmi.index');

    Route::get('admin/feedback', [AdminFeedbackController::class, 'index'])->name('feedback');
    Route::delete('/feedback/{id}', [AdminFeedbackController::class, 'destroy'])->name('feedback.destroy');
});

require __DIR__ . '/auth.php';
