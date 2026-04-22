<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Exercise;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ExerciseController extends Controller
{
    /**
     * Display a listing of the exercises.
     */
    public function index(Request $request)
    {
        $query = Exercise::query();

        // Search Filter
        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        return Inertia::render('Admin/Exercises', [
            // Ensure withQueryString is here to maintain filters during page navigation
            'exercises' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
            'stats' => [
                'total' => Exercise::count(),
                'avgMet' => round(Exercise::avg('met_value') ?? 0, 1),
            ]
        ]);
    }

    /**
     * Store a newly created exercise in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'met_value'   => 'required|numeric|between:0,99.99',
            'media_type'  => 'required|in:file,youtube',
            // media_type က file ဆိုရင် video file ပါရမယ်၊ youtube ဆိုရင် URL ပါရမယ်
            'media'       => 'nullable|required_if:media_type,file|file|mimes:mp4,mov,avi|max:50000',
            'youtube_url' => 'nullable|required_if:media_type,youtube|url',
        ]);

        $mediaPath = null;

        if ($request->media_type === 'file' && $request->hasFile('media')) {
            // Local File သိမ်းဆည်းခြင်း
            $mediaPath = $request->file('media')->store('exercises', 'public');
        } else {
            // YouTube Link သိမ်းဆည်းခြင်း
            $mediaPath = $request->youtube_url;
        }

        Exercise::create([
            'title'       => $validated['title'],
            'description' => $validated['description'],
            'met_value'   => $validated['met_value'],
            'media_type'  => $validated['media_type'], // ဒီမှာ youtube သို့မဟုတ် file ဖြစ်သွားမယ်
            'media_path'  => $mediaPath,
        ]);

        return back()->with('success', 'Exercise created successfully.');
    }

    /**
     * Update the specified exercise in storage.
     */
    public function update(Request $request, Exercise $exercise)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'met_value'   => 'required|numeric|between:0,99.99',
            'media_type'  => 'required|in:file,youtube',
            'media'       => 'nullable|file|mimes:mp4,mov,avi|max:50000',
            'youtube_url' => 'nullable|url',
        ]);

        $data = [
            'title'       => $validated['title'],
            'description' => $validated['description'],
            'met_value'   => $validated['met_value'],
            'media_type'  => $validated['media_type'],
        ];

        if ($request->media_type === 'file') {
            // File အသစ် တင်ခဲ့လျှင်
            if ($request->hasFile('media')) {
                // အဟောင်းက file ဖြစ်နေခဲ့ရင် storage ထဲက အရင်ဖျက်မယ်
                if ($exercise->media_type === 'file' && $exercise->media_path) {
                    Storage::disk('public')->delete($exercise->media_path);
                }
                $data['media_path'] = $request->file('media')->store('exercises', 'public');
            } else {
                // File အသစ်မတင်ရင် အဟောင်းအတိုင်း ဆက်ထားမယ် (ဒါမှမဟုတ် YouTube ကနေ ပြန်ပြောင်းလာတာဆိုရင် media_path မရှိတော့လို့ logic စစ်ဖို့လိုနိုင်တယ်)
                $data['media_path'] = $exercise->media_path;
            }
        } else {
            // YouTube Link သို့ ပြောင်းလိုက်လျှင်
            // အရင်က file ရှိခဲ့ရင် storage ထဲက ဖျက်ပစ်မယ်
            if ($exercise->media_type === 'file' && $exercise->media_path) {
                Storage::disk('public')->delete($exercise->media_path);
            }
            $data['media_path'] = $request->youtube_url;
        }

        $exercise->update($data);

        return back()->with('success', 'Exercise updated successfully.');
    }

    /**
     * Remove the specified exercise from storage.
     */
    public function destroy(Exercise $exercise)
    {
        // File သိမ်းထားတာဆိုရင် storage ထဲကပါ တစ်ခါတည်းဖျက်မယ်
        if ($exercise->media_type === 'file' && $exercise->media_path) {
            Storage::disk('public')->delete($exercise->media_path);
        }

        $exercise->delete();

        return back()->with('success', 'Exercise deleted successfully.');
    }
}