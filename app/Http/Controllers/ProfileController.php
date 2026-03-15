<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\BmiRecord;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'auth' => [
                'user' => $request->user(),
            ],
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validatedData = $request->validated();

        // 1. Check if physical data changed BEFORE we fill the model
        $statsChanged = ($user->weight != $request->weight || $user->height != $request->height);

        // 2. Fill the user model with validated data
        $user->fill($validatedData);

        // 3. BMI Logic
        if ($user->height > 0 && $user->weight > 0) {
            $heightInMeters = $user->height / 100;
            $bmi = $user->weight / ($heightInMeters * $heightInMeters);
            $user->current_bmi = round($bmi, 2);

            if ($statsChanged) {
                $category = match (true) {
                    $bmi < 18.5 => 'Underweight',
                    $bmi < 25   => 'Normal',
                    $bmi < 30   => 'Overweight',
                    $bmi < 35   => 'Obese Class I',
                    $bmi < 40   => 'Obese Class II',
                    default     => 'Obese Class III',
                };

                // Insert into bmi_records table
                BmiRecord::create([
                    'user_id'      => $user->id,
                    'weight'       => $user->weight,
                    'height'       => $user->height,
                    'bmi_value'    => $user->current_bmi,
                    'bmi_category' => $category,
                ]);
            }
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // 4. Save the user (This makes the change permanent)
        $user->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
