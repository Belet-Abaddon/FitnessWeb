<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\BmiRecord; // Ensure you have this Model created
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'age' => 'required|integer|min:10|max:100',
            'gender' => 'required|string|in:male,female,other',
            'height' => 'required|numeric|min:50|max:250',
            'weight' => 'required|numeric|min:20|max:300',
        ]);

        // 1. Calculate BMI Value
        $heightInMeters = $request->height / 100;
        $bmiValue = $request->weight / ($heightInMeters * $heightInMeters);
        $roundedBmi = round($bmiValue, 2);

        // 2. Determine BMI Category
        $category = $this->getBmiCategory($roundedBmi);

        // 3. Create the User
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
            'age' => $request->age,
            'gender' => $request->gender,
            'height' => $request->height,
            'weight' => $request->weight,
            'current_bmi' => $roundedBmi,
        ]);

        // 4. Auto-record in bmi_records table
        BmiRecord::create([
            'user_id' => $user->id,
            'weight' => $request->weight,
            'height' => $request->height,
            'bmi_value' => $roundedBmi,
            'bmi_category' => $category,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return $user->role === 'admin' 
            ? redirect()->route('admin.dashboard') 
            : redirect()->route('dashboard');
    }

    /**
     * Helper to get category based on WHO standards
     */
    private function getBmiCategory($bmi): string
    {
        if ($bmi < 18.5) return 'Underweight';
        if ($bmi < 25) return 'Normal';
        if ($bmi < 30) return 'Overweight';
        if ($bmi < 35) return 'Obese Class I';
        if ($bmi < 40) return 'Obese Class II';
        return 'Obese Class III';
    }
}