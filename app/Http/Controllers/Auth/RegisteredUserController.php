<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
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

    public function store(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $name = trim((string) ($validated['name'] ?? ''));
        if ($name === '') {
            $emailName = explode('@', $validated['email'], 2)[0] ?? 'User';
            $name = ucfirst(preg_replace('/[^a-zA-Z0-9]+/', ' ', $emailName));
        }

        $user = User::create([
            'name' => $name,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_admin' => false,
        ]);

        event(new Registered($user));

        Auth::login($user);

        $request->session()->regenerate();

        if ($user->is_admin) {
            return Inertia::location(url('/admin'));
        }

        return redirect()->intended('/');
    }
}
