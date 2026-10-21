<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'phone' => '081234567890',
        ]);

        $this->product = Product::create([
            'name'         => 'Choco Chip Cookie',
            'slug'         => 'choco-chip-cookie',
            'price'        => 25000,
            'description'  => 'Delicious chocolate chip cookie',
            'short_description' => 'Crunchy and sweet',
            'stock_status' => 'available',
            'is_published' => true,
        ]);
    }

    public function test_authenticated_user_can_access_checkout_page(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('orders.create', ['product_id' => $this->product->id]));

        $response->assertStatus(200);
    }

    public function test_guest_is_redirected_to_login_when_accessing_checkout(): void
    {
        $response = $this->get(route('orders.create'));

        $response->assertRedirect('/login');
    }

    public function test_user_can_place_cod_order_without_payment_proof(): void
    {
        $response = $this->actingAs($this->user)->post(route('orders.store'), [
            'customer_name'    => 'Budi Santoso',
            'customer_phone'   => '081234567890',
            'customer_address' => 'Jl. Merdeka No. 45, Jakarta Selatan',
            'payment_method'   => 'cod',
            'items'            => [
                [
                    'product_id' => $this->product->id,
                    'quantity'   => 2,
                ],
            ],
        ]);

        $order = Order::first();
        $this->assertNotNull($order);
        $this->assertEquals('Budi Santoso', $order->customer_name);
        $this->assertEquals('cod', $order->payment_method);
        $this->assertEquals(50000, $order->total_price);
        $this->assertNull($order->payment_proof);
        $this->assertCount(1, $order->items);

        $response->assertRedirect(route('orders.success', ['orderNumber' => $order->order_number]));
    }

    public function test_qris_order_requires_payment_proof(): void
    {
        $response = $this->actingAs($this->user)->post(route('orders.store'), [
            'customer_name'    => 'Siti Aminah',
            'customer_phone'   => '081298765432',
            'customer_address' => 'Jl. Sudirman No. 10',
            'payment_method'   => 'qris',
            'items'            => [
                [
                    'product_id' => $this->product->id,
                    'quantity'   => 1,
                ],
            ],
        ]);

        $response->assertSessionHasErrors('payment_proof');
        $this->assertEquals(0, Order::count());
    }

    public function test_user_can_place_qris_order_with_valid_payment_proof(): void
    {
        Storage::fake('public');

        $proofFile = UploadedFile::fake()->image('bukti_transfer.jpg');

        $response = $this->actingAs($this->user)->post(route('orders.store'), [
            'customer_name'    => 'Siti Aminah',
            'customer_phone'   => '081298765432',
            'customer_address' => 'Jl. Sudirman No. 10',
            'payment_method'   => 'qris',
            'payment_proof'    => $proofFile,
            'items'            => [
                [
                    'product_id' => $this->product->id,
                    'quantity'   => 3,
                ],
            ],
        ]);

        $order = Order::first();
        $this->assertNotNull($order);
        $this->assertEquals('qris', $order->payment_method);
        $this->assertNotNull($order->payment_proof);
        $this->assertEquals(75000, $order->total_price);

        Storage::disk('public')->assertExists($order->payment_proof);

        $response->assertRedirect(route('orders.success', ['orderNumber' => $order->order_number]));
    }

    public function test_public_can_view_order_success_page(): void
    {
        $order = Order::create([
            'order_number'     => 'ORD-TEST-1234',
            'user_id'          => $this->user->id,
            'customer_name'    => 'Andi',
            'customer_phone'   => '08111222333',
            'customer_address' => 'Alamat Lengkap',
            'payment_method'   => 'cod',
            'total_price'      => 25000,
            'status'           => 'pending',
        ]);

        $order->items()->create([
            'product_id'     => $this->product->id,
            'product_name'   => $this->product->name,
            'unit_price'     => 25000,
            'quantity'       => 1,
            'subtotal_price' => 25000,
        ]);

        $response = $this->get(route('orders.success', ['orderNumber' => $order->order_number]));

        $response->assertStatus(200);
    }

    public function test_public_can_track_order_by_order_number_or_phone(): void
    {
        $order = Order::create([
            'order_number'     => 'ORD-TRACK-999',
            'customer_name'    => 'Maya',
            'customer_phone'   => '089988776655',
            'customer_address' => 'Bandung',
            'payment_method'   => 'cod',
            'total_price'      => 50000,
            'status'           => 'processing',
        ]);

        // Cari via order_number
        $response1 = $this->get(route('orders.track', ['search' => 'ORD-TRACK-999']));
        $response1->assertStatus(200);

        // Cari via customer_phone
        $response2 = $this->get(route('orders.track', ['search' => '089988776655']));
        $response2->assertStatus(200);
    }
}
