<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_from_admin(): void
    {
        $response = $this->get('/admin');
        $response->assertRedirect('/login');
    }

    public function test_regular_user_cannot_access_admin(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $response = $this->actingAs($user)->get('/admin');
        $response->assertForbidden();
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->get('/admin');
        $response->assertOk();
    }

    public function test_admin_can_access_products_page(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->get('/admin/produk');
        $response->assertOk();
    }

    public function test_admin_can_access_articles_page(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->get('/admin/artikel');
        $response->assertOk();
    }

    public function test_admin_can_access_reviews_page(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->get('/admin/ulasan');
        $response->assertOk();
    }

    public function test_admin_can_access_settings_page(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->get('/admin/pengaturan');
        $response->assertOk();
    }

    public function test_legacy_mobile_admin_redirects_to_admin(): void
    {
        $response = $this->get('/mobile-admin');
        $response->assertRedirect('/admin');

        $responseNested = $this->get('/mobile-admin/produk');
        $responseNested->assertRedirect('/admin/produk');
    }
}
