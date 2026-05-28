<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Models\NutritionTip;
use App\Models\FitnessKnowledge;
use App\Models\Exercise;
use App\Models\ExercisePlan;
use Illuminate\Support\Collection;

class IndexEverythingToMongo extends Command
{
    protected $signature = 'fitness:index-all';
    protected $description = 'Index all fitness data to Local MongoDB using Ollama mxbai-embed-large';

    public function handle()
    {
        set_time_limit(0);

        $this->info("🚀 Starting Indexing process with Ollama (mxbai-embed-large)...");

        DB::connection('mongodb')->table('fitness_rag_store')->truncate();
        $this->warn("Clear existing MongoDB store... Done.");

        $this->processCollection(NutritionTip::limit(100)->get(), 'nutrition', 'name', 'content');
        $this->processCollection(FitnessKnowledge::limit(100)->get(), 'knowledge', 'question', 'answer');
        $this->processCollection(Exercise::all(), 'exercise', 'name', 'description');
        $this->indexPlans();

        $this->info("\n✅ [COMPLETED] All collections indexed successfully!");
    }

    private function processCollection(Collection $items, string $sourceType, string $titleField, string $contentField): void
    {
        $total = $items->count();
        $this->info("\n--- Indexing $sourceType ($total items) ---");

        foreach ($items as $index => $item) {
            $count = $index + 1;

            $textToIndex = "Fitness context about " . $sourceType . ": " . $item->$titleField . ". Details: " . $item->$contentField;
            
            if (isset($item->duration)) {
                $textToIndex .= " Duration: " . $item->duration;
            }

            $embedding = $this->getOllamaEmbedding($textToIndex);

            if ($embedding) {
                DB::connection('mongodb')->table('fitness_rag_store')->insert([
                    'original_id' => $item->id,
                    'source_type' => $sourceType,
                    'text'        => $textToIndex,
                    'embedding'   => $embedding,
                    'category'    => $item->category ?? 'General',
                    'created_at'  => now(),
                ]);
                $this->info("✔️ [$count/$total] Indexed: " . $item->$titleField);
            }
        }
    }

    private function indexPlans()
    {
        $plans = ExercisePlan::with('exercises')->get();
        $total = $plans->count();
        $this->info("\n--- Indexing Exercise Plans ($total items) ---");

        foreach ($plans as $index => $plan) {
            $count = $index + 1;
            $detailedExercises = "";
            foreach ($plan->exercises as $ex) {
                $detailedExercises .= "- Day {$ex->pivot->day_number}: {$ex->name} for {$ex->pivot->duration_minutes} minutes\n";
            }

            $textToIndex = "Fitness Workout Plan Name: {$plan->name}. Description: {$plan->description}. Target BMI Goal: From BMI {$plan->min_bmi_category} to {$plan->max_bmi_category}. Full Day-by-Day Schedule Routine:\n" . $detailedExercises;
            $embedding = $this->getOllamaEmbedding($textToIndex);

            if ($embedding) {
                DB::connection('mongodb')->table('fitness_rag_store')->insert([
                    'original_id' => $plan->id,
                    'source_type' => 'plan',
                    'text'        => $textToIndex,
                    'embedding'   => $embedding,
                    'category'    => $plan->difficulty_level,
                    'created_at'  => now(),
                ]);
                $this->info("✔️ [$count/$total] Fully Indexed Plan: " . $plan->name);
            }
        }
    }

    private function getOllamaEmbedding(string $text): ?array
    {
        try {
            $response = Http::timeout(60)->post("http://ollama:11434/api/embeddings", [
                'model' => 'mxbai-embed-large',
                'prompt' => $text,
            ]);

            return $response->successful() ? $response->json()['embedding'] : null;
        } catch (\Exception $e) {
            $this->error("Ollama Error: " . $e->getMessage());
            return null;
        }
    }
}