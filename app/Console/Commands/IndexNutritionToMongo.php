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
            $exists = DB::connection('mongodb')
                ->table('nutrition_tips')
                ->where('original_id', $item->id)
                ->exists();

            if ($exists) {
                $this->info("Skipping: " . $item->name);
                continue;
            }

            $embedding = $this->getLocalEmbedding($item->content);

            if ($embedding) {
                DB::connection('mongodb')
                    ->table('nutrition_tips')
                    ->insert([
                        'original_id' => $item->id,
                        'name' => $item->name,
                        'content' => $item->content,
                        'embedding' => $embedding, 
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
            $response = Http::timeout(30)
                ->withToken(env('MIXEDBREAD_API_KEY'))
                ->post("https://api.mixedbread.ai/v1/embeddings", [
                    "model" => "mixedbread-ai/mxbai-embed-large-v1",
                    "input" => $text,
                    "normalized" => true
                ]);

            if ($response->successful()) {
                // Response format: $response['data'][0]['embedding']
                return $response->json()['data'][0]['embedding'];
            }
        } catch (\Exception $e) {
            $this->error("Mixedbread connection error: " . $e->getMessage());
        }
        return null;
    }
}