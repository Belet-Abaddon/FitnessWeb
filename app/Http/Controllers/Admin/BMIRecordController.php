<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BmiRecord;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BMIRecordController extends Controller
{
    /**
     * Display the BMI Records page with database data.
     */
    public function index()
    {
        // Fetch records with user relationships, ordered by date
        $dbRecords = BmiRecord::with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($record) {
                // Find previous record for this specific user to calculate progress/change
                $previous = BmiRecord::where('user_id', $record->user_id)
                    ->where('created_at', '<', $record->created_at)
                    ->latest()
                    ->first();

                $currentBmi = (float) $record->bmi_value;
                $prevBmi = $previous ? (float) $previous->bmi_value : null;
                $change = $prevBmi ? round($currentBmi - $prevBmi, 2) : 0;
                $changePercent = $prevBmi ? round(($change / $prevBmi) * 100, 1) : 0;

                // Return a structure identical to your original initialRecords array
                return [
                    'id' => $record->id,
                    'userId' => $record->user_id,
                    'userName' => $record->user->name ?? 'Unknown User',
                    'userEmail' => $record->user->email ?? 'N/A',
                    'weight' => (float) $record->weight,
                    'height' => (float) $record->height,
                    'bmiValue' => $currentBmi,
                    'bmiCategory' => $record->bmi_category,
                    'recordedDate' => $record->created_at->format('Y-m-d'),
                    'previousBMI' => $prevBmi,
                    'change' => $change,
                    'changePercent' => $changePercent,
                    'status' => $change < 0 ? 'improving' : ($change > 0 ? 'worsening' : 'stable'),
                    'healthRisk' => $this->getRiskLevel($record->bmi_category),
                    'targetBMI' => 25.0, // Default target
                    'progress' => $this->calculateProgress($currentBmi),
                    'notes' => $record->notes ?? '',
                    // Mapping measurements/vitals even if not in DB to prevent frontend errors
                    'measurements' => [
                        'waist' => 0, 'hip' => 0, 'chest' => 0, 'arm' => 0
                    ],
                    'vitalSigns' => [
                        'bloodPressure' => 'N/A', 'heartRate' => 0, 'oxygenSaturation' => 0
                    ],
                ];
            });

        return Inertia::render('Admin/BMIRecords', [
            'dbRecords' => $dbRecords,
            'dbUsers' => User::select('id', 'name', 'email')->get()
        ]);
    }

    private function getRiskLevel($category) {
        return match ($category) {
            'Obese III' => 'Severe',
            'Obese II'  => 'Very High',
            'Obese I'   => 'High',
            'Overweight' => 'Moderate',
            default      => 'Low',
        };
    }

    private function calculateProgress($current) {
        // Simple logic: Closer to 25.0 means higher progress %
        if ($current <= 25) return 100;
        $diff = $current - 25;
        return max(0, min(100, round(100 - ($diff * 5))));
    }
}