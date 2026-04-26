<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Models\NutritionTip;
use App\Models\FitnessKnowledge;
use App\Models\Exercise;
use App\Models\ExercisePlan;

class IndexEverythingToMongo extends Command
{
    protected $signature = 'fitness:index-all';
    protected $description = 'Index all fitness data to Local MongoDB using Ollama Local Embedding';

    public function handle()
    {
        set_time_limit(0);

        $this->info("🚀 Starting the Indexing process with Ollama (nomic-embed-text)...");

        $this->processCollection(NutritionTip::all(), 'nutrition', 'name', 'content');

        $this->processCollection(FitnessKnowledge::all(), 'knowledge', 'question', 'answer');

        $this->processCollection(Exercise::all(), 'exercise', 'title', 'description');

        $this->indexPlans();

        $this->info("\n✅ [COMPLETED] All collections indexed successfully with Ollama!");
    }

    private function processCollection($items, $sourceType, $titleField, $contentField)
    {
        $total = $items->count();
        $this->info("\n--- Indexing $sourceType ($total items) ---");

        foreach ($items as $index => $item) {
            $count = $index + 1;

            $exists = DB::connection('mongodb')
                ->table('fitness_rag_store')
                ->where('original_id', $item->id)
                ->where('source_type', $sourceType)
                ->exists();

            if ($exists) {
                $this->line("⏩ [$count/$total] Skipping: " . $item->$titleField);
                continue;
            }

            $textToIndex = "Source: " . ucfirst($sourceType) . "\nTitle: " . $item->$titleField . "\nContent: " . $item->$contentField;

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
        $this->info("\n--- Indexing Exercise Plans with Full Details ($total items) ---");

        foreach ($plans as $index => $plan) {
            $count = $index + 1;

            $detailedExercises = "";
            foreach ($plan->exercises as $ex) {
                $detailedExercises .= "- Day {$ex->pivot->day_number}: {$ex->title} for {$ex->pivot->duration_minutes} minutes\n";
            }

            $textToIndex = "Source: Plan\n" .
                "Name: {$plan->name}\n" .
                "Description: {$plan->description}\n" .
                "Goal: BMI {$plan->min_bmi_category} to {$plan->max_bmi_category}\n" .
                "Weekly Routine Details:\n" . $detailedExercises;

            $embedding = $this->getOllamaEmbedding($textToIndex);

            if ($embedding) {
                DB::connection('mongodb')->table('fitness_rag_store')
                    ->where('original_id', $plan->id)
                    ->where('source_type', 'plan')
                    ->delete();

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

    private function getOllamaEmbedding($text)
    {
        try {
            $url = "http://ollama:11434/api/embeddings";

            $response = Http::timeout(60)->post($url, [
                'model' => 'mxbai-embed-large',
                'prompt' => $text,
            ]);

            if ($response->successful()) {
                return $response->json()['embedding'];
            }

            $this->error("Ollama API Error: " . $response->status() . " - " . $response->body());
        } catch (\Exception $e) {
            $this->error("Ollama Connection Error: " . $e->getMessage());
        }
        return null;
    }
}
