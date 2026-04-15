<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\NutritionTip;

class NutritionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // မင်းပြောတဲ့ D Drive ထဲက Path ကို ညွှန်ထားပါတယ်
        $filePath = "D:\\D\\PP\\Dataset.csv";

        // ဖိုင်ရှိမရှိ အရင်စစ်ဆေးမယ်
        if (!file_exists($filePath)) {
            $this->command->error("CSV file not found at: $filePath");
            return;
        }

        $file = fopen($filePath, "r");
        fgetcsv($file); // Header line (name, serving_size, etc.) ကို ကျော်မယ်

        while (($row = fgetcsv($file, 10000, ",")) !== FALSE) {
            // Dataset.csv အသစ်ရဲ့ Index များ (0 မှ 7 အထိ)
            $name         = $row[0] ?? 'Unknown';
            $serving_size = $row[1] ?? '100 g';
            $calories     = $row[2] ?? '0';
            $protein      = $row[3] ?? '0 g';
            $total_fat    = $row[4] ?? '0 g';
            $carbohydrate = $row[5] ?? '0 g';
            $fiber        = $row[6] ?? '0 g';
            $sugars       = $row[7] ?? '0 g';

            // AI အတွက် Readable ဖြစ်အောင် စာကြောင်းပြန်စီခြင်း
            $combinedContent = "A $serving_size serving of $name contains $calories calories. " .
                "Nutritional breakdown: Protein: $protein, Total Fat: $total_fat, " .
                "Carbohydrates: $carbohydrate (including $sugars of sugar), and Fiber: $fiber.";

            NutritionTip::create([
                'name' => $name,
                'content' => $combinedContent
            ]);
        }

        fclose($file);
        $this->command->info("Nutrition data seeded successfully!");
    }
}
