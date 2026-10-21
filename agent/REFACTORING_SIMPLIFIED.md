# Refactoring Plan - Semi-Organized Structure (SIMPLIFIED)

## 🎯 Target: Clean Architecture dengan Structure Minimal

**Philosophy:** 
- ✅ Keep controllers in **root** (flat structure)
- ✅ Organize logic dengan **routes & middleware**, bukan folders
- ✅ Extract **business logic** ke Services
- ✅ Extract **validation** ke Form Requests

---

## 🏗️ Structure Setelah Refactoring

```
app/Http/Controllers/
├── Auth/                      # Laravel Breeze (keep as is)
├── Controller.php             # Base
├── HomeController.php         # Public
├── ProductController.php      # Public
├── ArticleController.php      # Public
├── CartController.php         # User (auth middleware)
├── ProfileController.php      # User (auth middleware)
└── ReviewController.php       # User (auth middleware)

app/Http/Requests/
├── Auth/
├── Cart/                      # NEW
│   ├── AddToCartRequest.php
│   └── UpdateCartItemRequest.php
├── Profile/                   # NEW
│   └── UpdateProfileRequest.php
└── Review/                    # NEW
    └── StoreReviewRequest.php

app/Services/
├── ImageService.php           # Existing
├── ShopSettingService.php     # NEW
├── ProductService.php         # NEW
├── CartService.php            # NEW
├── ArticleService.php         # NEW
└── ReviewService.php          # NEW
```

---

## 📋 Implementation Steps

### **STEP 1: Create Services** (2-3 jam)

Create these service files:

1. **`app/Services/ShopSettingService.php`**
   - `getSettings()` - Get cached shop settings
   - `clearCache()` - Clear shop settings cache
   - `getLogoUrl($mode)` - Get logo URL
   - `getFaviconUrl()` - Get favicon URL

2. **`app/Services/ProductService.php`**
   - `getPublishedProducts($filters, $perPage)` - Get filtered products
   - `getProductBySlug($slug)` - Get single product
   - `incrementProductView($product)` - Track view count

3. **`app/Services/CartService.php`**
   - `getUserCart($user)` - Get user's cart
   - `addToCart($user, $productId, $quantity)` - Add item
   - `updateCartItemQuantity($cartItem, $quantity)` - Update qty
   - `removeCartItem($cartItem)` - Remove item
   - `clearCart($user)` - Clear all items
   - `formatCartForResponse($cart)` - Format for API

4. **`app/Services/ArticleService.php`**
   - `getPublishedArticles($perPage)` - Get articles
   - `getArticleBySlug($slug)` - Get single article
   - `incrementArticleView($article)` - Track view count
   - `getHeroArticles()` - Get hero articles

5. **`app/Services/ReviewService.php`**
   - `createReview($data)` - Create new review
   - `getApprovedReviews($limit)` - Get approved reviews
   - `getProductReviews($productId)` - Get reviews for product

**Register in AppServiceProvider:**
```php
public function register(): void
{
    $this->app->singleton(ShopSettingService::class);
    $this->app->singleton(CartService::class);
    $this->app->singleton(ProductService::class);
    $this->app->singleton(ArticleService::class);
    $this->app->singleton(ReviewService::class);
}
```

---

### **STEP 2: Create Form Requests** (2-3 jam)

Create these request files:

1. **`app/Http/Requests/Cart/AddToCartRequest.php`**
   ```php
   namespace App\Http\Requests\Cart;
   
   class AddToCartRequest extends FormRequest
   {
       public function rules(): array
       {
           return [
               'product_id' => ['required', 'integer', 'exists:products,id'],
               'quantity' => ['nullable', 'integer', 'min:1', 'max:100'],
           ];
       }
   }
   ```

2. **`app/Http/Requests/Cart/UpdateCartItemRequest.php`**
   ```php
   namespace App\Http\Requests\Cart;
   
   class UpdateCartItemRequest extends FormRequest
   {
       public function authorize(): bool
       {
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
   }
   ```

3. **`app/Http/Requests/Review/StoreReviewRequest.php`**
   ```php
   namespace App\Http\Requests\Review;
   
   class StoreReviewRequest extends FormRequest
   {
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
       
       public function passedValidation(): void
       {
           // Honeypot check
           if ($this->filled('website')) {
               $this->merge(['is_spam' => true]);
           }
       }
   }
   ```

4. **Move & Rename:** `app/Http/Requests/ProfileUpdateRequest.php` → `app/Http/Requests/Profile/UpdateProfileRequest.php`

---

### **STEP 3: Refactor Controllers** (3-4 jam)

Update these controllers (stay in root, no moving):

#### **1. CartController.php**
```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\Cart\AddToCartRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Models\CartItem;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function __construct(
        private readonly CartService $cartService
    ) {}

    public function index(Request $request)
    {
        $cart = $this->cartService->getCartWithItems($request->user());
        $formattedCart = $this->cartService->formatCartForResponse($cart);

        return Inertia::render('Cart/Index', [
            'cart' => $formattedCart,
        ]);
    }

    public function store(AddToCartRequest $request)
    {
        $productId = (int) $request->input('product_id');
        $quantity = max(1, (int) $request->input('quantity', 1));

        $cart = $this->cartService->addToCart(
            $request->user(),
            $productId,
            $quantity
        );

        return redirect()->route('cart.index')
            ->with('cart.flash', 'Produk berhasil ditambahkan ke keranjang!');
    }

    public function updateQuantity(UpdateCartItemRequest $request, CartItem $cartItem)
    {
        $this->cartService->updateCartItemQuantity(
            $cartItem,
            (int) $request->input('quantity')
        );

        return redirect()->route('cart.index');
    }

    public function destroy(Request $request, CartItem $cartItem)
    {
        if ((int) $cartItem->cart->user_id !== (int) $request->user()->id) {
            abort(403);
        }

        $this->cartService->removeCartItem($cartItem);
        return redirect()->route('cart.index');
    }

    public function clear(Request $request)
    {
        $this->cartService->clearCart($request->user());
        return redirect()->route('cart.index');
    }
}
```

#### **2. ProductController.php**
```php
<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductService $productService
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only(['stock_status', 'sort', 'search']);
        $products = $this->productService->getPublishedProducts($filters, 12);

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => $filters,
        ]);
    }

    public function show(string $slug)
    {
        $product = $this->productService->getProductBySlug($slug);
        $this->productService->incrementProductView($product);

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }
}
```

#### **3. ArticleController.php**
```php
<?php

namespace App\Http\Controllers;

use App\Services\ArticleService;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function __construct(
        private readonly ArticleService $articleService
    ) {}

    public function index()
    {
        $articles = $this->articleService->getPublishedArticles(9);
        return Inertia::render('Articles/Index', ['articles' => $articles]);
    }

    public function show(string $slug)
    {
        $article = $this->articleService->getArticleBySlug($slug);
        $this->articleService->incrementArticleView($article);
        return Inertia::render('Articles/Show', ['article' => $article]);
    }
}
```

#### **4. HomeController.php**
```php
<?php

namespace App\Http\Controllers;

use App\Services\{ArticleService, ProductService, ReviewService};
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __construct(
        private readonly ArticleService $articleService,
        private readonly ProductService $productService,
        private readonly ReviewService $reviewService
    ) {}

    public function __invoke()
    {
        return Inertia::render('Home', [
            'heroArticles' => $this->articleService->getHeroArticles(),
            'topProducts' => $this->productService->getPublishedProducts([], 8)->items(),
            'reviews' => $this->reviewService->getApprovedReviews(9),
        ]);
    }
}
```

#### **5. ReviewController.php**
```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\Review\StoreReviewRequest;
use App\Services\ReviewService;

class ReviewController extends Controller
{
    public function __construct(
        private readonly ReviewService $reviewService
    ) {}

    public function store(StoreReviewRequest $request)
    {
        // Check honeypot
        if ($request->input('is_spam')) {
            return back()->with('review_submitted', true);
        }

        $this->reviewService->createReview($request->validated());
        return back()->with('review_submitted', true);
    }
}
```

#### **6. ProfileController.php**
```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\Profile\UpdateProfileRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit(Request $request)
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function update(UpdateProfileRequest $request)
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();
        return Redirect::route('profile.edit');
    }

    public function destroy(Request $request)
    {
        $request->validate(['password' => ['required', 'current_password']]);
        $user = $request->user();
        Auth::logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return Redirect::to('/');
    }
}
```

---

### **STEP 4: Share ShopSettings Globally** (1-2 jam)

**Update:** `app/Http/Middleware/HandleInertiaRequests.php`

```php
<?php

namespace App\Http\Middleware;

use App\Services\ShopSettingService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
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
                'whatsappNumber' => $this->shopSettingService->getSettings()->whatsapp_number,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'cart.flash' => fn () => $request->session()->get('cart.flash'),
                'review_submitted' => fn () => $request->session()->get('review_submitted'),
            ],
        ]);
    }
}
```

---

### **STEP 5: Update Routes** (1 jam)

**File:** `routes/web.php`

```php
<?php

use App\Http\Controllers\{
    HomeController,
    ProductController,
    ArticleController,
    CartController,
    ProfileController,
    ReviewController
};

// ===== PUBLIC ROUTES (No Auth Required) =====
Route::get('/', HomeController::class)->name('home');

Route::prefix('products')->name('products.')->group(function () {
    Route::get('/', [ProductController::class, 'index'])->name('index');
    Route::get('/{slug}', [ProductController::class, 'show'])->name('show');
});

Route::prefix('articles')->name('articles.')->group(function () {
    Route::get('/', [ArticleController::class, 'index'])->name('index');
    Route::get('/{slug}', [ArticleController::class, 'show'])->name('show');
});

// ===== USER ROUTES (Auth Required) =====
Route::middleware(['auth', 'verified'])->group(function () {
    // Profile
    Route::prefix('profile')->name('profile.')->controller(ProfileController::class)->group(function () {
        Route::get('/', 'edit')->name('edit');
        Route::patch('/', 'update')->name('update');
        Route::delete('/', 'destroy')->name('destroy');
    });

    // Cart
    Route::prefix('cart')->name('cart.')->controller(CartController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::patch('/{cartItem}', 'updateQuantity')->name('update');
        Route::delete('/{cartItem}', 'destroy')->name('destroy');
        Route::post('/clear', 'clear')->name('clear');
    });

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store'])
        ->middleware('throttle:review')
        ->name('reviews.store');
});

// ===== AUTH ROUTES (Laravel Breeze) =====
require __DIR__.'/auth.php';
```

---

## ✅ Checklist Singkat

### Fase 1: Services
- [ ] Create 5 service classes
- [ ] Register in AppServiceProvider
- [ ] Test with tinker

### Fase 2: Requests
- [ ] Create Cart requests (2 files)
- [ ] Create Review request (1 file)
- [ ] Move Profile request (1 file)

### Fase 3: Controllers
- [ ] Refactor CartController
- [ ] Refactor ProductController
- [ ] Refactor ArticleController
- [ ] Refactor HomeController
- [ ] Refactor ReviewController
- [ ] Refactor ProfileController

### Fase 4: Global Settings
- [ ] Update HandleInertiaRequests
- [ ] Inject ShopSettingService
- [ ] Share shop settings globally

### Fase 5: Routes
- [ ] Update routes/web.php
- [ ] Verify route names unchanged
- [ ] Test all routes work

### Fase 6: Testing
- [ ] Test all public pages
- [ ] Test all user features
- [ ] Check for errors
- [ ] Run `php artisan test` (if exists)

### Fase 7: Cleanup
- [ ] Run `./vendor/bin/pint`
- [ ] Remove unused imports
- [ ] Add docblocks
- [ ] Commit changes

---

## ⏱️ Timeline

- **Step 1-2:** 4-6 hours
- **Step 3:** 3-4 hours  
- **Step 4-5:** 2-3 hours
- **Step 6-7:** 2-3 hours

**Total: 11-16 hours (2-3 hari kerja)**

---

## 🎯 Result

**Before:**
- ❌ Business logic in controllers
- ❌ Inline validation
- ❌ Repeated ShopSetting calls
- ❌ Hard to test

**After:**
- ✅ Thin controllers (< 50 lines/method)
- ✅ Form Request validation
- ✅ Business logic in Services
- ✅ Global ShopSettings
- ✅ Testable & maintainable
- ✅ **Still simple structure** (no complex folders!)

---

**Siap refactoring dengan structure yang simple! 🚀**
