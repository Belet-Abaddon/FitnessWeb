<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FitnessKnowledge;
use Illuminate\Support\Facades\File;

class FitnessKnowledgeSeeder extends Seeder
{
    public function run()
    {
        $json = File::get(database_path('data/categorized_fitness_data.json'));
        $data = json_decode($json);

        foreach ($data as $item) {
            FitnessKnowledge::create([
                'question' => $item->question,
                'answer'   => $item->answer,
                'category' => $item->category,
            ]);
        }
    }
}