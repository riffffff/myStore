# Refactoring Plan - Clean Architecture Implementation

## 🎯 Tujuan Refactoring

Sebelum implementasi rebranding PaiTech, kita akan refactor codebase untuk mengikuti **best practices Laravel**:

1. ✅ **Clean Controllers** - Controller hanya handle HTTP request/response
2. ✅ **Request Validation** - Semua validasi dipindah ke Form Request classes
3. ✅ **Business Logic di Services** - Logic bisnis di Service layer
4. ✅ **Proper Directory Structure** - Pemisahan jelas Admin vs Public controllers
5. ✅ **Consistent Naming** - Naming convention yang konsisten
6. ✅ **Dependency Injection** - Proper DI untuk testability

---

## 📊 Current State Analysis

### Existing Structure:
```
app/Http/Controllers/
├── Admin/                    # ✅ Already exists (empty - Filament handles admin)
├── Auth/                     # ✅ Breeze auth controllers
├── Public/                   # ✅ Public-facing controllers
│   ├── ArticleController.php
│   ├── HomeController.php
│   ├── ProductController.php
│   └── ReviewController.php
├── CartController.php        # ❌ Should be in Public/ or User/
├── ProfileController.php     # ❌ Should be in User/
└── Controller.php            # ✅ Base controller

app/Http/Requests/
├── Auth/                     # ✅ Auth requests
└── ProfileUpdateRequest.php  # ✅ Already using Form Request

app/Services/
└── ImageService.php          # ✅ Already exists
```

### Issues Found:
1. ❌ **Validasi di controller** - ReviewController, CartController have inline validation
2. ❌ **Business logic di controller** - Cart logic, product filtering in controllers
3. ❌ **No Service layer** - Only ImageService exists
4. ❌ **ShopSetting::getSettings()** dipanggil berulang di setiap controller
5. ✅ **Controller structure** - Already simple, no need for extra folders

---

## 🏗️ Target Structure (After Refactoring)

```
app/Http/Controllers/
├── Auth/                        # Authentication (Laravel Breeze - keep as is)
│   ├── AuthenticatedSessionController.php
│   ├── RegisteredUserController.php
│   └── ... (other auth controllers)
│
├── Controller.php               # Base controller
├── HomeController.php           # Public - no auth required
├── ProductController.php        # Public - no auth required
├── ArticleController.php        # Public - no auth required
├── CartController.php           # User - auth required (stays in root)
├── ProfileController.php        # User - auth required (stays in root)
└── ReviewController.php         # User - auth required (stays in root)

app/Http/Requests/
├── Auth/
│   └── LoginRequest.php
│
├── Cart/                        # ⭐ NEW - Cart requests
│   ├── AddToCartRequest.php
│   └── UpdateCartItemRequest.php
│
├── Review/                      # ⭐ NEW - Review requests
│   └── StoreReviewRequest.php
│
└── Profile/                     # ⭐ NEW - Profile requests
    └── UpdateProfileRequest.php

app/Services/
├── ImageService.php             # ✅ Existing
├── CartService.php              # ⭐ NEW - Cart business logic
├── ProductService.php           # ⭐ NEW - Product logic (filtering, search)
├── ArticleService.php           # ⭐ NEW - Article logic
├── ReviewService.php            # ⭐ NEW - Review logic
└── ShopSettingService.php       # ⭐ NEW - Shop settings cache management

app/Providers/
└── AppServiceProvider.php       # Register services + share shop settings
```

---

## 📋 Refactoring Phases

## **FASE 1: Setup Services Layer** (2-3 jam)

### 1.1 Create Service Classes

#### **ShopSettingService** (Highest Priority)
**File:** `app/Services/ShopSettingService.php`

**Purpose:** Centralize shop settings access and caching

```php
<?php

namespace App\Services;

use App\Models\ShopSetting;

class ShopSettingService
{
    private ?ShopSetting $settings = null;

    public function getSettings(): ShopSetting
    {
        if ($this->settings === null) {
            $this->settings = ShopSetting::getSettings();
        }
        
        return $this->settings;
    }

    public function clearCache(): void
    {
        ShopSetting::flushCache();
        $this->settings = null;
    }

    public function getThemeColors(): array
    {
        return $this->getSettings()->getThemeColors();
    }

    public function getLogoUrl(string $mode = 'light'): string
    {
        return $this->getSettings()->getLogoUrl($mode);
    }

    public function getFaviconUrl(): string
    {
        return $this->getSettings()->getFaviconUrl();
    }

    public function getWhatsAppNumber(): string
    {
        return $this->getSettings()->whatsapp_number;
    }

    public function getWhatsAppTemplate(): string
    {
        return $this->getSettings()->whatsapp_template;
    }
}
```

**Tasks:**
- [ ] Create `ShopSettingService.php`
- [ ] Implement methods
- [ ] Register in AppServiceProvider (singleton)
- [ ] Test service

---

#### **ProductService**
**File:** `app/Services/ProductService.php`

**Purpose:** Handle product filtering, sorting, search logic

```php
<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class ProductService
{
    public function getPublishedProducts(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = Product::with(['images' => function ($query) {
            $query->where('is_primary', true);
        }])->where('is_published', true);

        // Apply stock status filter
        if (!empty($filters['stock_status'])) {
            $this->applyStockStatusFilter($query, $filters['stock_status']);
        }

        // Apply search filter
        if (!empty($filters['search'])) {
            $this->applySearchFilter($query, $filters['search']);
        }

        // Apply sorting
        $this->applySorting($query, $filters['sort'] ?? 'newest');

        return $query->paginate($perPage)->withQueryString();
    }

    public function getProductBySlug(string $slug): Product
    {
        return Product::with('images')
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();
    }

    public function incrementProductView(Product $product): void
    {
        $product->incrementView();
    }

    private function applyStockStatusFilter(Builder $query, string $status): void
    {
        $allowedStatus = ['available', 'preorder', 'out_of_stock'];
        
        if (in_array($status, $allowedStatus, true)) {
            $query->where('stock_status', $status);
        }
    }

    private function applySearchFilter(Builder $query, string $search): void
    {
        $query->where(function (Builder $q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    private function applySorting(Builder $query, string $sort): void
    {
        match($sort) {
            'price_low' => $query->orderBy('price', 'asc'),
            'price_high' => $query->orderBy('price', 'desc'),
            'popular' => $query->orderBy('view_count', 'desc'),
            default => $query->orderBy('created_at', 'desc'),
        };
    }
}
```

**Tasks:**
- [ ] Create `ProductService.php`
- [ ] Implement filtering logic
- [ ] Implement sorting logic
- [ ] Implement search logic
- [ ] Add methods for getting top products

---

#### **CartService**
**File:** `app/Services/CartService.php`

**Purpose:** Handle all cart business logic

```php
<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CartService
{
    public function getUserCart(User $user): Cart
    {
        return $user->ensureCart();
    }

    public function getCartWithItems(User $user): Cart
    {
        $cart = $this->getUserCart($user);
        $cart->recalculateTotals();
        $cart->loadMissing(['items.product', 'items.product.images']);
        
        return $cart;
    }

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

    public function updateCartItemQuantity(CartItem $cartItem, int $quantity): void
    {
        DB::transaction(function () use ($cartItem, $quantity) {
            CartItem::lockForUpdate()->find($cartItem->id);
            $cartItem->quantity = $quantity;
            $cartItem->save();
        });
    }

    public function removeCartItem(CartItem $cartItem): void
    {
        $cartItem->delete();
    }

    public function clearCart(User $user): void
    {
        $cart = $this->getUserCart($user);
        $cart->items()->delete();
        $cart->recalculateTotals();
    }

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
                    : url('storage/' . ltrim($primaryImage->url, '/'));
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

    private function validateProductForCart(int $productId): Product
    {
        $product = Product::query()
            ->where('is_published', true)
            ->find($productId);

        if (!$product) {
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
```

**Tasks:**
- [ ] Create `CartService.php`
- [ ] Move cart logic from controller
- [ ] Implement all cart operations
- [ ] Test cart service

---

#### **ArticleService**
**File:** `app/Services/ArticleService.php`

```php
<?php

namespace App\Services;

use App\Models\Article;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ArticleService
{
    public function getPublishedArticles(int $perPage = 9): LengthAwarePaginator
    {
        return Article::published()->paginate($perPage);
    }

    public function getArticleBySlug(string $slug): Article
    {
        return Article::where('slug', $slug)
            ->published()
            ->firstOrFail();
    }

    public function incrementArticleView(Article $article): void
    {
        $article->incrementView();
    }

    public function getHeroArticles(): \Illuminate\Database\Eloquent\Collection
    {
        return Article::hero()->get();
    }
}
```

**Tasks:**
- [ ] Create `ArticleService.php`
- [ ] Move article logic from controller

---

#### **ReviewService**
**File:** `app/Services/ReviewService.php`

```php
<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Validation\ValidationException;

class ReviewService
{
    public function createReview(array $data): Review
    {
        // Validate product exists and is published
        $product = $this->validateProduct($data['product_id']);

        return Review::create([
            'product_id' => $data['product_id'],
            'name' => $data['name'],
            'city' => $data['city'] ?? null,
            'rating' => (int) $data['rating'],
            'review' => $data['review'],
            'is_approved' => false, // Always requires moderation
        ]);
    }

    public function getApprovedReviews(int $limit = 9)
    {
        return Review::where('is_approved', true)
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get();
    }

    public function getProductReviews(int $productId, bool $approvedOnly = true)
    {
        $query = Review::where('product_id', $productId);

        if ($approvedOnly) {
            $query->where('is_approved', true);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    private function validateProduct(int $productId): Product
    {
        $product = Product::where('id', $productId)
            ->where('is_published', true)
            ->first();

        if (!$product) {
            throw ValidationException::withMessages([
                'product_id' => ['Produk tidak ditemukan.'],
            ]);
        }

        return $product;
    }
}
```

**Tasks:**
- [ ] Create `ReviewService.php`
- [ ] Move review logic from controller

---

### 1.2 Register Services in AppServiceProvider

**File:** `app/Providers/AppServiceProvider.php`

```php
public function register(): void
{
    // Register services as singletons for better performance
    $this->app->singleton(ShopSettingService::class);
    $this->app->singleton(CartService::class);
    $this->app->singleton(ProductService::class);
    $this->app->singleton(ArticleService::class);
    $this->app->singleton(ReviewService::class);
}
```

**Tasks:**
- [ ] Register all services
- [ ] Test DI works

**Estimasi Fase 1:** 2-3 jam

---

## **FASE 2: Create Form Request Classes** (2-3 jam)

### 2.1 Cart Requests

#### **AddToCartRequest**
**File:** `app/Http/Requests/Cart/AddToCartRequest.php`

```php
<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class AddToCartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Produk harus dipilih.',
            'product_id.exists' => 'Produk tidak ditemukan.',
            'quantity.min' => 'Jumlah minimal 1.',
            'quantity.max' => 'Jumlah maksimal 100.',
        ];
    }

    public function getProductId(): int
    {
        return (int) $this->input('product_id');
    }

    public function getQuantity(): int
    {
        return max(1, (int) ($this->input('quantity', 1)));
    }
}
```

#### **UpdateCartItemRequest**
**File:** `app/Http/Requests/Cart/UpdateCartItemRequest.php`

```php
<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCartItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Check if cart item belongs to user
        $cartItem = $this->route('cartItem');
        return $this->user() && 
               $cartItem && 
               (int) $cartItem->cart->user_id === (int) $this->user()->id;
    }

    public function rules(): array
    {
        return [
            'quantity' => ['required', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function getQuantity(): int
    {
        return (int) $this->input('quantity');
    }
}
```

**Tasks:**
- [ ] Create `AddToCartRequest.php`
- [ ] Create `UpdateCartItemRequest.php`
- [ ] Test validation

---

### 2.2 Review Request

#### **StoreReviewRequest**
**File:** `app/Http/Requests/Review/StoreReviewRequest.php`

```php
<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Public can submit reviews (will be moderated)
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'name' => ['required', 'string', 'min:2', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'review' => ['required', 'string', 'min:10', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama harus diisi.',
            'name.min' => 'Nama minimal 2 karakter.',
            'rating.required' => 'Rating harus dipilih.',
            'rating.min' => 'Rating minimal 1 bintang.',
            'rating.max' => 'Rating maksimal 5 bintang.',
            'review.required' => 'Review harus diisi.',
            'review.min' => 'Review minimal 10 karakter.',
            'review.max' => 'Review maksimal 2000 karakter.',
        ];
    }

    public function validated($key = null, $default = null)
    {
        $validated = parent::validated($key, $default);

        // Remove honeypot field if exists
        unset($validated['website']);

        return $validated;
    }

    public function passedValidation(): void
    {
        // Check honeypot - if filled, mark as spam
        if ($this->filled('website')) {
            $this->merge(['is_spam' => true]);
        }
    }
}
```

**Tasks:**
- [ ] Create `StoreReviewRequest.php`
- [ ] Include honeypot check
- [ ] Test validation

---

### 2.3 Profile Request (Already exists, just move)

**Tasks:**
- [ ] Move `ProfileUpdateRequest.php` to `app/Http/Requests/Profile/`
- [ ] Update namespace
- [ ] Update imports in ProfileController

**Estimasi Fase 2:** 2-3 jam

---

## **FASE 3: Refactor Controllers** (3-4 jam)

### 3.1 Reorganize Controller Directory Structure

**Actions:**
1. Create `app/Http/Controllers/` directory
2. Move `CartController.php` to `User/CartController.php`
3. Move `ProfileController.php` to `User/ProfileController.php`
4. Move or copy `ReviewController.php` to `User/ReviewController.php`

---

### 3.2 Refactor CartController

**File:** `app/Http/Controllers/CartController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
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

        return redirect()
            ->route('cart.index')
            ->with('cart.flash', sprintf(
                '✅ %s sebanyak %d item(s) telah ditambahkan ke keranjang!',
                $product?->name ?? 'Produk',
                $quantity
            ));
    }

    public function updateQuantity(
        UpdateCartItemRequest $request,
        CartItem $cartItem
    ): RedirectResponse {
        $this->cartService->updateCartItemQuantity(
            $cartItem,
            $request->getQuantity()
        );

        return redirect()->route('cart.index');
    }

    public function destroy(Request $request, CartItem $cartItem): RedirectResponse
    {
        // Authorization already handled by UpdateCartItemRequest logic
        if ((int) $cartItem->cart->user_id !== (int) $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $this->cartService->removeCartItem($cartItem);

        return redirect()->route('cart.index');
    }

    public function clear(Request $request): RedirectResponse
    {
        $this->cartService->clearCart($request->user());

        return redirect()->route('cart.index');
    }
}
```

**Tasks:**
- [ ] Move file to User directory
- [ ] Update namespace
- [ ] Inject CartService
- [ ] Use Form Requests
- [ ] Remove all business logic
- [ ] Update routes
- [ ] Test all cart operations

---

### 3.3 Refactor ProductController

**File:** `app/Http/Controllers/ProductController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductService $productService
    ) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['stock_status', 'sort', 'search']);
        
        $products = $this->productService->getPublishedProducts($filters, 12);

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => $filters,
        ]);
    }

    public function show(string $slug): Response
    {
        $product = $this->productService->getProductBySlug($slug);
        
        // Track view count
        $this->productService->incrementProductView($product);

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }
}
```

**Tasks:**
- [ ] Inject ProductService
- [ ] Remove business logic
- [ ] Remove ShopSetting calls (will be shared globally)
- [ ] Test product listing and detail

---

### 3.4 Refactor ArticleController

**File:** `app/Http/Controllers/ArticleController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ArticleService;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function __construct(
        private readonly ArticleService $articleService
    ) {}

    public function index(): Response
    {
        $articles = $this->articleService->getPublishedArticles(9);

        return Inertia::render('Articles/Index', [
            'articles' => $articles,
        ]);
    }

    public function show(string $slug): Response
    {
        $article = $this->articleService->getArticleBySlug($slug);
        
        // Track view count
        $this->articleService->incrementArticleView($article);

        return Inertia::render('Articles/Show', [
            'article' => $article,
        ]);
    }
}
```

**Tasks:**
- [ ] Inject ArticleService
- [ ] Remove business logic
- [ ] Remove ShopSetting calls

---

### 3.5 Refactor HomeController

**File:** `app/Http/Controllers/HomeController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ArticleService;
use App\Services\ProductService;
use App\Services\ReviewService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private readonly ArticleService $articleService,
        private readonly ProductService $productService,
        private readonly ReviewService $reviewService
    ) {}

    public function __invoke(): Response
    {
        $heroArticles = $this->articleService->getHeroArticles();
        $topProducts = $this->productService->getPublishedProducts([], 8);
        $reviews = $this->reviewService->getApprovedReviews(9);

        return Inertia::render('Home', [
            'heroArticles' => $heroArticles,
            'topProducts' => $topProducts->items(),
            'reviews' => $reviews,
        ]);
    }
}
```

**Tasks:**
- [ ] Inject services
- [ ] Remove queries from controller
- [ ] Remove ShopSetting calls

---

### 3.6 Refactor ReviewController

**File:** `app/Http/Controllers/ReviewController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Services\ReviewService;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
    public function __construct(
        private readonly ReviewService $reviewService
    ) {}

    /**
     * Store review with honeypot and spam protection.
     */
    public function store(StoreReviewRequest $request): RedirectResponse
    {
        // Check if honeypot detected spam
        if ($request->input('is_spam')) {
            // Return fake success to fool bots
            return back()->with('review_submitted', true);
        }

        $this->reviewService->createReview($request->validated());

        return back()->with('review_submitted', true);
    }
}
```

**Tasks:**
- [ ] Move to User directory
- [ ] Use StoreReviewRequest
- [ ] Inject ReviewService
- [ ] Test review submission

---

### 3.7 Refactor ProfileController

**File:** `app/Http/Controllers/ProfileController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateProfileRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
```

**Tasks:**
- [ ] Move to User directory
- [ ] Update Request import path
- [ ] Update routes

**Estimasi Fase 3:** 3-4 jam

---

## **FASE 4: Global ShopSettings via Middleware** (1-2 jam)

### 4.1 Share ShopSettings Globally

**Update:** `app/Http/Middleware/HandleInertiaRequests.php`

```php
public function __construct(
    private readonly ShopSettingService $shopSettingService
) {}

public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'auth' => [
            'user' => $request->user(),
        ],
        'shopSettings' => fn () => [
            'name' => $this->shopSettingService->getSettings()->shop_name,
            'description' => $this->shopSettingService->getSettings()->description,
            'logo' => $this->shopSettingService->getLogoUrl('light'),
            'logoDark' => $this->shopSettingService->getLogoUrl('dark'),
            'favicon' => $this->shopSettingService->getFaviconUrl(),
            'whatsappNumber' => $this->shopSettingService->getWhatsAppNumber(),
            'whatsappTemplate' => $this->shopSettingService->getWhatsAppTemplate(),
            // Add more as needed
        ],
        'flash' => [
            'success' => fn () => $request->session()->get('success'),
            'error' => fn () => $request->session()->get('error'),
            'cart.flash' => fn () => $request->session()->get('cart.flash'),
            'review_submitted' => fn () => $request->session()->get('review_submitted'),
        ],
    ]);
}
```

**Benefits:**
- ✅ No need to pass `shopSettings` in every controller
- ✅ Available globally via `usePage().props.shopSettings`
- ✅ Centralized management

**Tasks:**
- [ ] Inject ShopSettingService
- [ ] Share shop settings globally
- [ ] Remove shopSettings from all controller responses
- [ ] Test frontend still receives data

**Estimasi Fase 4:** 1-2 jam

---

## **FASE 5: Update Routes** (1 jam)

### 5.1 Update Route Namespaces

**File:** `routes/web.php`

Update route namespaces untuk reflect new structure:

```php
// Public routes (no auth)
Route::controller(App\Http\Controllers\HomeController::class)->group(function () {
    Route::get('/', '__invoke')->name('home');
});

Route::prefix('products')->name('products.')->group(function () {
    Route::get('/', [App\Http\Controllers\ProductController::class, 'index'])->name('index');
    Route::get('/{slug}', [App\Http\Controllers\ProductController::class, 'show'])->name('show');
});

Route::prefix('articles')->name('articles.')->group(function () {
    Route::get('/', [App\Http\Controllers\ArticleController::class, 'index'])->name('index');
    Route::get('/{slug}', [App\Http\Controllers\ArticleController::class, 'show'])->name('show');
});

// User routes (auth required)
Route::middleware(['auth', 'verified'])->group(function () {
    // Profile
    Route::prefix('profile')->name('profile.')->controller(App\Http\Controllers\ProfileController::class)->group(function () {
        Route::get('/', 'edit')->name('edit');
        Route::patch('/', 'update')->name('update');
        Route::delete('/', 'destroy')->name('destroy');
    });

    // Cart
    Route::prefix('cart')->name('cart.')->controller(App\Http\Controllers\CartController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::patch('/{cartItem}', 'updateQuantity')->name('update');
        Route::delete('/{cartItem}', 'destroy')->name('destroy');
        Route::post('/clear', 'clear')->name('clear');
    });

    // Reviews
    Route::post('/reviews', [App\Http\Controllers\ReviewController::class, 'store'])
        ->middleware('throttle:review')
        ->name('reviews.store');
});
```

**Tasks:**
- [ ] Update all route controller references
- [ ] Test all routes work
- [ ] Run `php artisan route:list` to verify

**Estimasi Fase 5:** 1 jam

---

## **FASE 6: Testing & Verification** (2-3 jam)

### 6.1 Manual Testing Checklist

**Public Pages:**
- [ ] Homepage loads
- [ ] Product listing loads
- [ ] Product detail loads
- [ ] Product filtering works
- [ ] Product sorting works
- [ ] Article listing loads
- [ ] Article detail loads
- [ ] View counts increment

**User Features (Auth Required):**
- [ ] Can add product to cart
- [ ] Can view cart
- [ ] Can update cart quantity
- [ ] Can remove item from cart
- [ ] Can clear cart
- [ ] Can submit review
- [ ] Honeypot blocks spam
- [ ] Profile can be updated

**Admin (Filament):**
- [ ] All Filament resources still work
- [ ] No broken imports

---

### 6.2 Automated Testing (Optional)

**Create Feature Tests:**
```bash
php artisan make:test CartServiceTest
php artisan make:test ProductServiceTest
php artisan make:test ReviewServiceTest
```

**Tasks:**
- [ ] Write tests for CartService
- [ ] Write tests for ProductService
- [ ] Write tests for ReviewService
- [ ] Run `php artisan test`

**Estimasi Fase 6:** 2-3 jam

---

## **FASE 7: Documentation & Cleanup** (1 jam)

### 7.1 Update Code Comments

**Tasks:**
- [ ] Add docblocks to all service methods
- [ ] Add comments to complex logic
- [ ] Update README if needed

### 7.2 Code Cleanup

**Tasks:**
- [ ] Remove unused imports
- [ ] Run `./vendor/bin/pint` (Laravel Pint - code formatter)
- [ ] Remove old commented code
- [ ] Verify no `dd()` or `dump()` left

### 7.3 Git Commit

```bash
git add .
git commit -m "refactor: implement clean architecture with services layer

- Separate controllers into Public/ and User/ namespaces
- Extract business logic to Service classes (Cart, Product, Article, Review, ShopSetting)
- Move validations to Form Request classes
- Share ShopSettings globally via Inertia middleware
- Update routes to reflect new structure
- Improve code maintainability and testability"
```

**Estimasi Fase 7:** 1 jam

---

## 📊 Summary: Time Estimates

| Fase | Tasks | Estimasi |
|------|-------|----------|
| **1. Services Layer** | Create 5 service classes | 2-3 jam |
| **2. Form Requests** | Create validation classes | 2-3 jam |
| **3. Refactor Controllers** | Clean up all controllers | 3-4 jam |
| **4. Global ShopSettings** | Share via middleware | 1-2 jam |
| **5. Update Routes** | Update route files | 1 jam |
| **6. Testing** | Manual + automated testing | 2-3 jam |
| **7. Documentation** | Comments, cleanup, commit | 1 jam |
| **TOTAL** | | **12-17 jam** |

**Recommended: 2-3 hari kerja untuk 1 developer**

---

## ✅ Benefits After Refactoring

### Code Quality:
- ✅ **Thin Controllers** - Easy to read and maintain
- ✅ **Reusable Services** - Business logic can be reused
- ✅ **Testable** - Services can be unit tested
- ✅ **Single Responsibility** - Each class has one job
- ✅ **DRY** - No code duplication

### Developer Experience:
- ✅ **Clear Structure** - Easy to find files
- ✅ **Predictable** - Consistent patterns
- ✅ **Scalable** - Easy to add new features
- ✅ **Maintainable** - Easy to debug and fix

### Performance:
- ✅ **Service Singletons** - Reduced object creation
- ✅ **Cached ShopSettings** - No repeated queries
- ✅ **Optimized Queries** - Centralized in services

---

## 🚀 After Refactoring

**You'll be ready for:**
1. ✅ PaiTech Rebranding (clean codebase)
2. ✅ Theme Customization System
3. ✅ Future feature additions
4. ✅ Team collaboration
5. ✅ Automated testing

---

## 📝 Notes

### Backward Compatibility:
- Route names remain the same (no frontend changes needed)
- API contracts unchanged (Inertia props structure same)
- Database unchanged (pure code refactoring)

### Breaking Changes:
- None! This is pure refactoring

### Migration Strategy:
- Can be done incrementally (phase by phase)
- Each phase is independently testable
- Low risk of breaking production

---

**Document Version:** 1.0  
**Created:** 2026-09-20  
**Status:** Ready for Implementation  
**Prerequisites:** None - can start immediately

---

**Ready to refactor? Let's make this codebase clean! 🧹✨**
