<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Models\NutritionTip;

class IndexNutritionToMongo extends Command
{
    protected $signature = 'nutrition:mongo';
    protected $description = 'Index Nutrition Tips to MongoDB using Local Ollama Embeddings';

    public function handle()
    {
        $items = NutritionTip::all();
        $this->info("Indexing " . $items->count() . " items to MongoDB using Ollama...");

        foreach ($items as $item) {
            // MongoDB မှာ ရှိပြီးသားလား စစ်မယ်
            $exists = DB::connection('mongodb')
                ->table('nutrition_tips')
                ->where('original_id', $item->id)
                ->exists();

            if ($exists) {
                $this->info("Skipping: " . $item->name);
                continue;
            }

            // Local Ollama ကိုသုံးပြီး Embedding ယူမယ်
            $embedding = $this->getLocalEmbedding($item->content);

            if ($embedding) {
                DB::connection('mongodb')
                    ->table('nutrition_tips')
                    ->insert([
                        'original_id' => $item->id,
                        'name' => $item->name,
                        'content' => $item->content,
                        'embedding' => $embedding, // ဒါက 1024 dimensions ဖြစ်မယ်
                        'category' => $item->category,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                $this->info("Successfully indexed: " . $item->name);
            } else {
                $this->error("Failed for: " . $item->name . ". Retrying...");
                sleep(2);
            }
        }

        $this->info("All data indexed successfully with Ollama!");
    }

    private function getLocalEmbedding($text)
    {
        try {
            // Ollama Local API Endpoint
            $response = Http::timeout(30)->post("http://localhost:11434/api/embeddings", [
                "model" => "mxbai-embed-large",
                "prompt" => $text
            ]);

            if ($response->successful()) {
                return $response->json()['embedding'];
            }
        } catch (\Exception $e) {
            $this->error("Ollama connection error: " . $e->getMessage());
        }
        return null;
    }
}