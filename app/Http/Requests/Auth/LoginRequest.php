<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'login'    => ['nullable', 'string'],
            'email'    => ['nullable', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $loginInput = trim((string) ($this->input('login') ?: $this->input('email')));
        if ($loginInput === '') {
            throw ValidationException::withMessages([
                'email' => 'Nomor HP atau Email wajib diisi.',
                'login' => 'Nomor HP atau Email wajib diisi.',
            ]);
        }

        $credentials = [
            'password' => $this->input('password'),
        ];

        if (str_contains($loginInput, '@') || filter_var($loginInput, FILTER_VALIDATE_EMAIL)) {
            $email = strtolower($loginInput);
            // Toleransi jika user memasukkan email tanpa .com atau sebaliknya
            if (! \App\Models\User::where('email', $email)->exists()) {
                if (\App\Models\User::where('email', $email . '.com')->exists()) {
                    $email = $email . '.com';
                } elseif (str_ends_with($email, '.com') && \App\Models\User::where('email', substr($email, 0, -4))->exists()) {
                    $email = substr($email, 0, -4);
                }
            }
            $credentials['email'] = $email;
        } else {
            // Cek nomor telepon dengan normalisasi PhoneNumber
            $normalizedPhone = \App\Support\PhoneNumber::normalize($loginInput);
            $user = \App\Models\User::where('phone', $normalizedPhone)
                ->orWhere('phone', $loginInput)
                ->first();

            if ($user) {
                $credentials['id'] = $user->id;
            } else {
                $credentials['phone'] = $normalizedPhone ?: $loginInput;
            }
        }

        if (! Auth::attempt($credentials, $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
                'login' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        $loginInput = $this->string('login')->value() ?: $this->string('email')->value();
        return Str::transliterate(Str::lower($loginInput).'|'.$this->ip());
    }
}
