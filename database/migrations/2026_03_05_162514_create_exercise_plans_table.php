<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exercise_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->integer('total_days')->default(30);
            $table->decimal('target_weight_loss', 5, 2)->nullable();
            $table->string('min_bmi_category'); // Changed to help logic
            $table->string('max_bmi_category');
            $table->string('difficulty_level'); // Beginner, Intermediate, etc.
            $table->enum('status', ['published', 'unpublished'])->default('published');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercise_plans');
    }
};
