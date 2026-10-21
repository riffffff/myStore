<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Service for cart-related business logic.
 *
 * Handles cart operations including add, update, remove, and formatting.
 */
class CartService
{
    /**
     * Get user's cart (ensures cart exists).
     */
    public function getUserCart(User $user): Cart
    {
        return $user->ensureCart();
    }

    /**
     * Get cart with items and recalculate totals.
     */
    public function getCartWithItems(User $user): Cart
    {
        $cart = $this->getUserCart($user);
        $cart->recalculateTotals();
        $cart->loadMissing(['items.product', 'items.product.images']);

        return $cart;
    }

    /**
     * Add product to cart.
     *
     * @throws ValidationException
     */
    public function addToCart(User $user, int $productId, int $quantity = 1): Cart
    {
        $product = $this->validateProductForCart($productId);
        $cart = $this->getUserCart($user);

        DB::transaction(function () use ($cart, $product, $quantity) {
            $lockedCart = Cart::lockForUpdate()->find($cart->id);

            $existing = CartItem::query()
                ->where('cart_id', $lockedCart->id)
                ->where('product_id', $product->id)
                ->lockForUpdate()
                ->first();

            if ($existing) {
                $existing->quantity += $quantity;
                $existing->save();
            } else {
                CartItem::create([
                    'cart_id' => $lockedCart->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => (int) $product->price,
                    'subtotal_price' => (int) $product->price * $quantity,
                ]);
            }

            $lockedCart->recalculateTotals();
        });

        return $cart->fresh();
    }

    /**
     * Update cart item quantity.
     */
    public function updateCartItemQuantity(CartItem $cartItem, int $quantity): void
    {
        DB::transaction(function () use ($cartItem, $quantity) {
            CartItem::lockForUpdate()->find($cartItem->id);
            $cartItem->quantity = $quantity;
            $cartItem->save();
        });
    }

    /**
     * Remove item from cart.
     */
    public function removeCartItem(CartItem $cartItem): void
    {
        $cartItem->delete();
    }

    /**
     * Clear all items from cart.
     */
    public function clearCart(User $user): void
    {
        $cart = $this->getUserCart($user);
        $cart->items()->delete();
        $cart->recalculateTotals();
    }

    /**
     * Format cart data for API/frontend response.
     */
    public function formatCartForResponse(Cart $cart): array
    {
        $itemsFormatted = $cart->items->map(function (CartItem $item) {
            $product = $item->product;
            $primaryImage = $product?->images?->firstWhere('is_primary', true)
                ?? $product?->images?->first();

            $imageUrl = null;
            if ($primaryImage?->url) {
                $imageUrl = (str_starts_with($primaryImage->url, 'http') || str_starts_with($primaryImage->url, '/'))
                    ? $primaryImage->url
                    : url('storage/'.ltrim($primaryImage->url, '/'));
            }

            return [
                'id' => $item->id,
                'cart_id' => $item->cart_id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'subtotal_price' => $item->subtotal_price,
                'product' => [
                    'id' => $product?->id,
                    'name' => $product?->name ?? '(Produk tidak ditemukan)',
                    'slug' => $product?->slug,
                    'stock_status' => $product?->stock_status ?? 'out_of_stock',
                    'image_url' => $imageUrl,
                ],
            ];
        })->values();

        return [
            'id' => $cart->id,
            'total_quantity' => $cart->total_quantity,
            'total_price' => $cart->total_price,
            'items' => $itemsFormatted,
        ];
    }

    /**
     * Validate product for cart (must be published and in stock).
     *
     * @throws ValidationException
     */
    private function validateProductForCart(int $productId): Product
    {
        $product = Product::query()
            ->where('is_published', true)
            ->find($productId);

        if (! $product) {
            throw ValidationException::withMessages([
                'product_id' => ['Produk tidak ditemukan atau belum diterbitkan.'],
            ]);
        }

        if ($product->stock_status === 'out_of_stock') {
            throw ValidationException::withMessages([
                'product_id' => ['Maaf, produk ini sedang habis (Sold Out).'],
            ]);
        }

        return $product;
    }
}
