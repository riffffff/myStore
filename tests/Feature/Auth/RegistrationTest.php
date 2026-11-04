<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/');
    }

    public function test_user_can_register_with_phone_number_only(): void
    {
        $response = $this->post('/register', [
            'name' => 'Budi Pengguna',
            'phone' => '081234567891',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/');

        $this->assertDatabaseHas('users', [
            'phone' => '6281234567891',
            'email' => '6281234567891@customer.local',
        ]);
    }

    public function test_duplicate_phone_with_different_format_fails_gracefully(): void
    {
        // First registration with 08...
        $this->post('/register', [
            'name' => 'User Pertama',
            'phone' => '081234567892',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        auth()->logout();

        // Attempt second registration as guest with format variation +62 812-3456-7892
        $response = $this->post('/register', [
            'name' => 'User Kedua',
            'phone' => '+62 812-3456-7892',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertSessionHasErrors('phone');
    }

    public function test_invalid_phone_number_is_rejected(): void
    {
        $response = $this->post('/register', [
            'name' => 'User Invalid',
            'phone' => '12345',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertSessionHasErrors('phone');
    }
}
