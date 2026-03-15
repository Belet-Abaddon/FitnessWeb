<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/UsersInfo', [
            'users' => $users,
            'filters' => $request->only('search'), // This sends the search term back to React
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['admin', 'user'])],
        ]);

        // Fix: Check if the user being edited IS the currently logged-in admin
        if (Auth::id() === $user->id && $validated['role'] !== 'admin') {
            return back()->with('message', 'You cannot demote your own account.');
        }

        $user->update(['role' => $validated['role']]);

        return back()->with('message', "Role for {$user->name} updated to {$validated['role']}.");
    }
}