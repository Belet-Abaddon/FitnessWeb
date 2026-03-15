<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request; // Add this
use Illuminate\Support\Facades\Auth; // Add this
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Using Auth facade is safer and prevents "Undefined method" errors
        if (Auth::check() && Auth::user()->role === 'admin') {
            return $next($request);
        }

        return redirect('/dashboard')->with('error', 'You do not have admin access.');
    }
}