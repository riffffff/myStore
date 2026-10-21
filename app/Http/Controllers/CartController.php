<?php

namespace App\Http\Controllers;

use App\Http\Requests\Cart\AddToCartRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Models\CartItem;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(
        private readonly CartService $cartService
    ) {}

    public function index(Request $request): Response
    {
        $cart = $this->cartService->getCartWithItems($request->user());
        $formattedCart = $this->cartService->formatCartForResponse($cart);

        return Inertia::render('Cart/Index', [
            'cart' => $formattedCart,
        ]);
    }

    public function store(AddToCartRequest $request): RedirectResponse
    {
        $productId = $request->getProductId();
        $quantity = $request->getQuantity();

        $cart = $this->cartService->addToCart(
            $request->user(),
            $productId,
            $quantity
        );

        $product = $cart->items()
            ->where('product_id', $productId)
            ->first()
            ?->product;

        return back()->with('success', sprintf(
            '%s (%d item) berhasil ditambahkan ke keranjang.',
            $product?->name ?? 'Produk',
            $quantity
        ));
    }

    public function updateQuantity(UpdateCartItemRequest $request, CartItem $cartItem): RedirectResponse
    {
        $this->cartService->updateCartItemQuantity(
            $cartItem,
            $request->getQuantity()
        );

        return redirect()->route('cart.index');
    }

    public function destroy(Request $request, CartItem $cartItem): RedirectResponse
    {
        // Authorization check
        if ((int) $cartItem->cart->user_id !== (int) $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $this->cartService->removeCartItem($cartItem);

        return redirect()->route('cart.index')->with('success', 'Item berhasil dihapus dari keranjang.');
    }

    public function clear(Request $request): RedirectResponse
    {
        $this->cartService->clearCart($request->user());

        return redirect()->route('cart.index')->with('success', 'Keranjang berhasil dikosongkan.');
    }
}
