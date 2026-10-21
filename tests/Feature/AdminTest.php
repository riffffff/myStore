<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Article;
use App\Models\ShopSetting;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\UploadedFile;
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

    public function test_admin_can_create_product_with_multiple_images(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->post('/admin/produk', [
            'name' => 'Produk Galeri',
            'price' => 150000,
            'stock_status' => 'available',
            'category' => 'lainnya',
            'description' => 'Produk dengan beberapa foto',
            'is_published' => '1',
            'images' => [
                UploadedFile::fake()->image('depan.jpg'),
                UploadedFile::fake()->image('samping.jpg'),
                UploadedFile::fake()->image('detail.jpg'),
            ],
        ]);

        $response->assertSessionHas('success');
        $product = Product::where('name', 'Produk Galeri')->firstOrFail();
        $this->assertSame(3, ProductImage::where('product_id', $product->id)->count());
        $this->assertSame(1, ProductImage::where('product_id', $product->id)->where('is_primary', true)->count());
    }

    public function test_admin_can_delete_product_image_without_deleting_product(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $product = Product::create([
            'name' => 'Produk Hapus Gambar',
            'short_description' => 'Ringkas',
            'description' => 'Deskripsi',
            'price' => 100000,
            'stock_status' => 'available',
            'is_published' => true,
        ]);
        $first = ProductImage::create([
            'product_id' => $product->id,
            'url' => 'produk/first.webp',
            'is_primary' => true,
            'sort_order' => 0,
        ]);
        $second = ProductImage::create([
            'product_id' => $product->id,
            'url' => 'produk/second.webp',
            'is_primary' => false,
            'sort_order' => 1,
        ]);

        $response = $this->actingAs($admin)->delete("/admin/produk/{$product->id}/gambar/{$first->id}");

        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('product_images', ['id' => $first->id]);
        $this->assertDatabaseHas('product_images', ['id' => $second->id, 'is_primary' => true]);
        $this->assertDatabaseHas('products', ['id' => $product->id]);
    }

    public function test_admin_cannot_delete_an_image_belonging_to_another_product(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $product = Product::create([
            'name' => 'Produk A',
            'short_description' => 'Ringkas',
            'description' => 'Deskripsi',
            'price' => 100000,
            'stock_status' => 'available',
            'is_published' => true,
        ]);
        $otherProduct = Product::create([
            'name' => 'Produk B',
            'short_description' => 'Ringkas',
            'description' => 'Deskripsi',
            'price' => 100000,
            'stock_status' => 'available',
            'is_published' => true,
        ]);
        $image = ProductImage::create([
            'product_id' => $otherProduct->id,
            'url' => 'produk/other.webp',
            'is_primary' => true,
            'sort_order' => 0,
        ]);

        $response = $this->actingAs($admin)->delete("/admin/produk/{$product->id}/gambar/{$image->id}");

        $response->assertNotFound();
        $this->assertDatabaseHas('product_images', ['id' => $image->id]);
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

    public function test_admin_settings_are_saved_and_shared_to_public(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->post('/admin/pengaturan', [
            'shop_name' => 'Toko Baru',
            'shop_tagline' => 'Furniture pilihan',
            'shop_phone' => '08123456789',
            'shop_email' => 'info@tokobaru.test',
            'shop_address' => 'Jl. Contoh No. 1',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('shop_settings', [
            'shop_name' => 'Toko Baru',
            'email' => 'info@tokobaru.test',
            'hero_banner_text_1' => 'Furniture pilihan',
        ]);

        $public = $this->get('/');
        $public->assertInertia(fn ($page) => $page
            ->where('shopSettings.shop_name', 'Toko Baru')
            ->where('shopSettings.email', 'info@tokobaru.test')
        );
    }

    public function test_admin_can_mark_article_as_homepage_hero(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->post('/admin/artikel', [
            'title' => 'Artikel Hero',
            'excerpt' => 'Ringkasan',
            'content' => 'Konten artikel hero',
            'is_published' => '1',
            'is_hero' => '1',
        ]);

        $response->assertSessionHas('success');
        $article = Article::firstOrFail();
        $this->assertTrue($article->is_hero);

        $public = $this->get('/');
        $public->assertInertia(fn ($page) => $page
            ->where('heroArticles.0.title', 'Artikel Hero')
        );
    }

    public function test_admin_can_access_orders_page(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->get('/admin/pesanan');
        $response->assertOk();
    }

    public function test_admin_can_update_order_status(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $order = \App\Models\Order::create([
            'order_number'      => 'ORD-TEST-001',
            'customer_name'     => 'Budi Test',
            'customer_address'  => 'Jl. Test No 1',
            'customer_phone'    => '08123456789',
            'payment_method'    => 'cod',
            'status'            => 'pending',
            'total_price'       => 150000,
        ]);

        $response = $this->actingAs($admin)->post("/admin/pesanan/{$order->id}/status", [
            'status' => 'confirmed',
        ]);

        $response->assertSessionHas('success');
        $this->assertEquals('confirmed', $order->fresh()->status);
    }

    public function test_admin_can_delete_order(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $order = \App\Models\Order::create([
            'order_number'      => 'ORD-TEST-DELETE',
            'customer_name'     => 'Budi Delete',
            'customer_address'  => 'Jl. Test No 2',
            'customer_phone'    => '08123456780',
            'payment_method'    => 'cod',
            'status'            => 'pending',
            'total_price'       => 200000,
        ]);

        $response = $this->actingAs($admin)->delete("/admin/pesanan/{$order->id}");

        $response->assertRedirect('/admin/pesanan');
        $this->assertDatabaseMissing('orders', ['id' => $order->id]);
    }

    public function test_legacy_mobile_admin_redirects_to_admin(): void
    {
        $response = $this->get('/mobile-admin');
        $response->assertRedirect('/admin');

        $responseNested = $this->get('/mobile-admin/produk');
        $responseNested->assertRedirect('/admin/produk');
    }
}
