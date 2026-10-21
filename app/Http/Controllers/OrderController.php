<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        private readonly CartService $cartService
    ) {}

    /**
     * Tampilkan formulir pemesanan / checkout ala Shopee.
     */
    public function create(Request $request): Response
    {
        $user = $request->user();
        $productId = $request->query('product_id');
        $qty = max(1, (int) $request->query('quantity', 1));

        $initialItems = [];

        // 1. Skenario beli langsung 1 produk
        if ($productId) {
            $product = Product::where('is_published', true)
                ->with('primaryImage', 'images')
                ->find($productId);

            if ($product && $product->stock_status !== 'out_of_stock') {
                $primaryImg = $product->primaryImage ?? $product->images->first();
                $imgUrl = null;
                if ($primaryImg?->url) {
                    $imgUrl = (str_starts_with($primaryImg->url, 'http') || str_starts_with($primaryImg->url, '/'))
                        ? $primaryImg->url
                        : asset('storage/' . ltrim($primaryImg->url, '/'));
                }

                $initialItems[] = [
                    'product_id' => $product->id,
                    'quantity'   => $qty,
                    'product'    => [
                        'id'           => $product->id,
                        'name'         => $product->name,
                        'price'        => (float) $product->price,
                        'stock_status' => $product->stock_status,
                        'image_url'    => $imgUrl,
                    ],
                ];
            }
        }

        // 2. Skenario dari keranjang jika belum ada produk langsung & user login
        if (empty($initialItems) && $user) {
            $cart = $this->cartService->getCartWithItems($user);
            $cartFormatted = $this->cartService->formatCartForResponse($cart);

            foreach ($cartFormatted['items'] as $item) {
                if ($item['product']['stock_status'] !== 'out_of_stock') {
                    $initialItems[] = [
                        'product_id' => $item['product_id'],
                        'quantity'   => $item['quantity'],
                        'product'    => [
                            'id'           => $item['product']['id'],
                            'name'         => $item['product']['name'],
                            'price'        => (float) $item['unit_price'],
                            'stock_status' => $item['product']['stock_status'],
                            'image_url'    => $item['product']['image_url'],
                        ],
                    ];
                }
            }
        }

        // Ambil semua produk aktif untuk opsi quick-add/pilih produk lain
        $allProducts = Product::where('is_published', true)
            ->with(['primaryImage', 'images'])
            ->get()
            ->map(function (Product $p) {
                $primaryImg = $p->primaryImage ?? $p->images->first();
                $imgUrl = null;
                if ($primaryImg?->url) {
                    $imgUrl = (str_starts_with($primaryImg->url, 'http') || str_starts_with($primaryImg->url, '/'))
                        ? $primaryImg->url
                        : asset('storage/' . ltrim($primaryImg->url, '/'));
                }

                return [
                    'id'           => $p->id,
                    'name'         => $p->name,
                    'price'        => (float) $p->price,
                    'stock_status' => $p->stock_status,
                    'image_url'    => $imgUrl,
                ];
            });

        return Inertia::render('Order/Create', [
            'initialItems' => $initialItems,
            'allProducts'  => $allProducts,
            'customer'     => [
                'name'    => $user?->name ?? '',
                'phone'   => $user?->phone ?? '',
                'address' => '',
            ],
        ]);
    }

    /**
     * Simpan transaksi pemesanan baru.
     */
    public function store(StoreOrderRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $order = DB::transaction(function () use ($request, $validated, $user) {
            // Upload bukti bayar jika ada (wajib untuk QRIS)
            $proofPath = null;
            if ($request->hasFile('payment_proof')) {
                $proofPath = $request->file('payment_proof')->store('payment_proofs', 'public');
            }

            // Hitung total dan persiapkan item dari DB untuk integritas harga
            $productIds = collect($validated['items'])->pluck('product_id')->all();
            $products = Product::whereIn('id', $productIds)
                ->where('is_published', true)
                ->get()
                ->keyBy('id');

            $totalPrice = 0;
            $orderItemsData = [];

            foreach ($validated['items'] as $item) {
                $product = $products->get($item['product_id']);
                if (! $product) {
                    continue;
                }

                $qty = (int) $item['quantity'];
                $unitPrice = (float) $product->price;
                $subtotal = $unitPrice * $qty;
                $totalPrice += $subtotal;

                $orderItemsData[] = [
                    'product_id'     => $product->id,
                    'product_name'   => $product->name,
                    'unit_price'     => $unitPrice,
                    'quantity'       => $qty,
                    'subtotal_price' => $subtotal,
                ];
            }

            // Buat record order
            $order = Order::create([
                'user_id'          => $user?->id,
                'customer_name'    => $validated['customer_name'],
                'customer_address' => $validated['customer_address'],
                'customer_phone'   => $validated['customer_phone'],
                'payment_method'   => $validated['payment_method'],
                'payment_proof'    => $proofPath,
                'status'           => 'pending',
                'total_price'      => $totalPrice,
                'notes'            => $validated['notes'] ?? null,
            ]);

            // Simpan detail item pesanan
            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            // Hapus produk yang sudah dipesan dari keranjang jika ada
            if ($user && $user->cart) {
                $user->cart->items()->whereIn('product_id', $productIds)->delete();
                $user->cart->recalculateTotals();
            }

            return $order;
        });

        return redirect()->route('orders.success', ['orderNumber' => $order->order_number])
            ->with('success', 'Pesanan Anda berhasil dibuat!');
    }

    /**
     * Tampilkan halaman sukses pemesanan.
     */
    public function success(string $orderNumber): Response
    {
        $order = Order::with(['items.product.images', 'items.product.primaryImage'])
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        $formattedOrder = $this->formatOrder($order);

        return Inertia::render('Order/Success', [
            'order' => $formattedOrder,
        ]);
    }

    /**
     * Halaman lacak status pesanan.
     */
    public function track(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $user = $request->user();

        $query = Order::with(['items.product.images', 'items.product.primaryImage'])->latest();

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhere('customer_phone', 'like', "%{$search}%");
            });
            $orders = $query->limit(50)->get();
        } elseif ($user) {
            // Jika login dan tidak ada query pencarian, tampilkan pesanan user
            $orders = $user->orders()
                ->with(['items.product.images', 'items.product.primaryImage'])
                ->latest()
                ->limit(50)
                ->get();
        } else {
            $orders = collect();
        }

        $formattedOrders = $orders->map(fn (Order $o) => $this->formatOrder($o));

        return Inertia::render('Order/Track', [
            'orders' => $formattedOrders,
            'search' => $search,
        ]);
    }

    /**
     * Format data order untuk response frontend.
     */
    private function formatOrder(Order $order): array
    {
        return [
            'id'                => $order->id,
            'order_number'      => $order->order_number,
            'user_id'           => $order->user_id,
            'customer_name'     => $order->customer_name,
            'customer_address'  => $order->customer_address,
            'customer_phone'    => $order->customer_phone,
            'payment_method'    => $order->payment_method,
            'payment_proof'     => $order->payment_proof,
            'payment_proof_url' => $order->payment_proof ? asset('storage/' . $order->payment_proof) : null,
            'status'            => $order->status,
            'total_price'       => (float) $order->total_price,
            'notes'             => $order->notes,
            'created_at'        => $order->created_at->format('d M Y, H:i'),
            'items'             => $order->items->map(function (OrderItem $item) {
                $product = $item->product;
                $primaryImg = $product?->primaryImage ?? $product?->images?->first();
                $imgUrl = null;
                if ($primaryImg?->url) {
                    $imgUrl = (str_starts_with($primaryImg->url, 'http') || str_starts_with($primaryImg->url, '/'))
                        ? $primaryImg->url
                        : asset('storage/' . ltrim($primaryImg->url, '/'));
                }

                return [
                    'id'             => $item->id,
                    'order_id'       => $item->order_id,
                    'product_id'     => $item->product_id,
                    'product_name'   => $item->product_name,
                    'unit_price'     => (float) $item->unit_price,
                    'quantity'       => $item->quantity,
                    'subtotal_price' => (float) $item->subtotal_price,
                    'product'        => $product ? [
                        'id'        => $product->id,
                        'name'      => $product->name,
                        'slug'      => $product->slug,
                        'image_url' => $imgUrl,
                    ] : null,
                ];
            })->values()->all(),
        ];
    }
}
