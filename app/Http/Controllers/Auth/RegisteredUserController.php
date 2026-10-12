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
            'name'     => 'required|string|max:255',
            'phone'    => 'nullable|string|max:25|unique:'.User::class.',phone',
            'email'    => 'nullable|string|lowercase|email|max:255|unique:'.User::class.',email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'name.required'     => 'Nama lengkap wajib diisi.',
            'phone.unique'      => 'Nomor HP ini sudah terdaftar. Silakan masuk / login.',
            'email.unique'      => 'Email ini sudah terdaftar.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.confirmed'=> 'Konfirmasi kata sandi tidak cocok.',
        ]);

        if (empty($validated['phone']) && empty($validated['email'])) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'phone' => 'Nomor HP atau Email wajib diisi.',
            ]);
        }

        $name = trim((string) $validated['name']);
        $phone = !empty($validated['phone']) ? $validated['phone'] : null;
        $cleanPhone = $phone ? preg_replace('/[^0-9]/', '', $phone) : null;
        $email = !empty($validated['email']) ? strtolower($validated['email']) : ($cleanPhone ? $cleanPhone . '@customer.local' : 'user_' . uniqid() . '@customer.local');

        $user = User::create([
            'name'     => $name,
            'phone'    => $phone,
            'email'    => $email,
            'password' => Hash::make($validated['password']),
            'is_admin' => false,
        ]);

        event(new Registered($user));

        Auth::login($user);

        $request->session()->regenerate();

        if ($user->is_admin) {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->intended('/');
    }
}
