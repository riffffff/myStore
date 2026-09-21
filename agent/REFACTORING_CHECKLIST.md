# Refactoring Checklist - Semi-Organized Structure

Track progress refactoring ke clean architecture (simplified structure).

**Structure:** Controllers stay in root, organized by routes & middleware.

---

## 🚀 PRE-REFACTORING

### Setup
- [ ] Backup database
- [ ] Create branch: `refactor/clean-architecture`
- [ ] Review refactoring plan
- [ ] Ensure tests pass (if any): `php artisan test`
- [ ] Ensure app works: test manually

---

## 📦 FASE 1: Services Layer (2-3 jam)

### 1.1 Create Service Classes

**All services in:** `app/Services/`

- [ ] Create `app/Services/ShopSettingService.php`
  - [ ] `getSettings()` method
  - [ ] `clearCache()` method
  - [ ] `getThemeColors()` method
  - [ ] `getLogoUrl()` method
  - [ ] `getFaviconUrl()` method
  - [ ] `getWhatsAppNumber()` method
  - [ ] `getWhatsAppTemplate()` method

- [ ] Create `app/Services/ProductService.php`
  - [ ] `getPublishedProducts()` method
  - [ ] `getProductBySlug()` method
  - [ ] `incrementProductView()` method
  - [ ] `applyStockStatusFilter()` method (private)
  - [ ] `applySearchFilter()` method (private)
  - [ ] `applySorting()` method (private)

- [ ] Create `app/Services/CartService.php`
  - [ ] `getUserCart()` method
  - [ ] `getCartWithItems()` method
  - [ ] `addToCart()` method
  - [ ] `updateCartItemQuantity()` method
  - [ ] `removeCartItem()` method
  - [ ] `clearCart()` method
  - [ ] `formatCartForResponse()` method
  - [ ] `validateProductForCart()` method (private)

- [ ] Create `app/Services/ArticleService.php`
  - [ ] `getPublishedArticles()` method
  - [ ] `getArticleBySlug()` method
  - [ ] `incrementArticleView()` method
  - [ ] `getHeroArticles()` method

- [ ] Create `app/Services/ReviewService.php`
  - [ ] `createReview()` method
  - [ ] `getApprovedReviews()` method
  - [ ] `getProductReviews()` method
  - [ ] `validateProduct()` method (private)

### 1.2 Register Services

- [ ] Update `app/Providers/AppServiceProvider.php`
- [ ] Register `ShopSettingService::class` as singleton
- [ ] Register `CartService::class` as singleton
- [ ] Register `ProductService::class` as singleton
- [ ] Register `ArticleService::class` as singleton
- [ ] Register `ReviewService::class` as singleton

### 1.3 Test Services

- [ ] Test `ShopSettingService` in tinker
- [ ] Test `ProductService` in tinker
- [ ] Test `CartService` in tinker
- [ ] Test `ArticleService` in tinker
- [ ] Test `ReviewService` in tinker

### Git Commit
- [ ] Commit: "feat: add service layer for business logic"

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Done  
**Time Spent:** ___ hours

---

## 📝 FASE 2: Form Request Classes (2-3 jam)

### 2.1 Cart Requests

- [ ] Create directory: `app/Http/Requests/Cart/`
- [ ] Create `AddToCartRequest.php`
  - [ ] `authorize()` method
  - [ ] `rules()` method
  - [ ] `messages()` method
  - [ ] `getProductId()` helper
  - [ ] `getQuantity()` helper
- [ ] Create `UpdateCartItemRequest.php`
  - [ ] `authorize()` with ownership check
  - [ ] `rules()` method
  - [ ] `getQuantity()` helper

### 2.2 Review Request

- [ ] Create directory: `app/Http/Requests/Review/`
- [ ] Create `StoreReviewRequest.php`
  - [ ] `authorize()` method
  - [ ] `rules()` method
  - [ ] `messages()` method
  - [ ] `validated()` override (remove honeypot)
  - [ ] `passedValidation()` for honeypot check

### 2.3 Profile Request

- [ ] Create directory: `app/Http/Requests/Profile/`
- [ ] Move `app/Http/Requests/ProfileUpdateRequest.php`
- [ ] Rename to `UpdateProfileRequest.php`
- [ ] Update namespace to `App\Http\Requests\Profile`

### 2.4 Test Requests

- [ ] Test `AddToCartRequest` validation
- [ ] Test `UpdateCartItemRequest` authorization
- [ ] Test `StoreReviewRequest` honeypot
- [ ] Test `UpdateProfileRequest` still works

### Git Commit
- [ ] Commit: "feat: add Form Request classes for validation"

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Done  
**Time Spent:** ___ hours

---

## 🎯 FASE 3: Refactor Controllers (3-4 jam)

### 3.1 Controllers Stay in Root ✅

**No moving needed!** All controllers stay in `app/Http/Controllers/`

- ✅ HomeController.php
- ✅ ProductController.php
- ✅ ArticleController.php
- ✅ CartController.php
- ✅ ProfileController.php
- ✅ ReviewController.php

Routes & middleware organize access control.

---

### 3.2 Refactor CartController

- [ ] Edit `app/Http/Controllers/CartController.php` (stays in root)
- [ ] Inject `CartService` in constructor
- [ ] Update `index()` - use service
- [ ] Update `store()` - use `AddToCartRequest` and service
- [ ] Update `updateQuantity()` - use `UpdateCartItemRequest` and service
- [ ] Update `destroy()` - use service
- [ ] Update `clear()` - use service
- [ ] Remove all business logic
- [ ] Remove `ShopSetting::getSettings()` calls

### 3.3 Refactor ProfileController

- [ ] Edit `app/Http/Controllers/ProfileController.php` (stays in root)
- [ ] Update `UpdateProfileRequest` import path
- [ ] Verify methods still work (no major changes needed)

### 3.4 Refactor ReviewController

- [ ] Edit `app/Http/Controllers/ReviewController.php` (stays in root OR move from Public/)
- [ ] Inject `ReviewService` in constructor
- [ ] Update `store()` - use `StoreReviewRequest` and service
- [ ] Remove business logic
- [ ] Handle honeypot in controller (check `is_spam` flag)

### 3.5 Refactor ProductController

- [ ] Edit `app/Http/Controllers/ProductController.php` (or Public/ProductController.php)
- [ ] Inject `ProductService` in constructor
- [ ] Update `index()` - use service for filtering/sorting
- [ ] Update `show()` - use service
- [ ] Remove `ShopSetting::getSettings()` calls
- [ ] Remove business logic

### 3.6 Refactor ArticleController

- [ ] Edit `app/Http/Controllers/ArticleController.php` (or Public/ArticleController.php)
- [ ] Inject `ArticleService` in constructor
- [ ] Update `index()` - use service
- [ ] Update `show()` - use service
- [ ] Remove `ShopSetting::getSettings()` calls

### 3.7 Refactor HomeController

- [ ] Edit `app/Http/Controllers/HomeController.php` (or Public/HomeController.php)
- [ ] Inject `ArticleService`, `ProductService`, `ReviewService`
- [ ] Update `__invoke()` - use all services
- [ ] Remove direct model queries
- [ ] Remove `ShopSetting::getSettings()` calls

### 3.8 Test All Controllers

- [ ] Test CartController - all methods
- [ ] Test ProfileController - all methods
- [ ] Test ReviewController - store method
- [ ] Test ProductController - index and show
- [ ] Test ArticleController - index and show
- [ ] Test HomeController - homepage loads

### Git Commit
- [ ] Commit: "refactor: clean controllers and move to proper namespaces"

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Done  
**Time Spent:** ___ hours

---

## 🌍 FASE 4: Global ShopSettings (1-2 jam)

### 4.1 Update Inertia Middleware

- [ ] Edit `app/Http/Middleware/HandleInertiaRequests.php`
- [ ] Inject `ShopSettingService` in constructor
- [ ] Update `share()` method
- [ ] Add `shopSettings` to shared data
- [ ] Add common flash messages to shared data
- [ ] Use lazy evaluation with `fn()`

### 4.2 Remove ShopSettings from Controllers

- [ ] Verify no controller passes `shopSettings` anymore
- [ ] Remove any remaining `ShopSetting::getSettings()` calls

### 4.3 Test Frontend

- [ ] Open browser DevTools
- [ ] Check `usePage().props` has `shopSettings`
- [ ] Verify all pages still work
- [ ] Check logo displays
- [ ] Check shop name displays

### Git Commit
- [ ] Commit: "feat: share shop settings globally via Inertia"

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Done  
**Time Spent:** ___ hours

---

## 🛣️ FASE 5: Update Routes (1 jam)

### 5.1 Update web.php

- [ ] Open `routes/web.php`
- [ ] Update CartController namespace (if moved from Public/)
- [ ] Update ProfileController namespace (if needed)
- [ ] Update ReviewController namespace (if moved from Public/)
- [ ] Organize routes with comments (Public, User, Admin sections)
- [ ] Verify route names unchanged (backward compatibility)

### 5.2 Verify Routes

- [ ] Run `php artisan route:list`
- [ ] Check all routes have correct controllers
- [ ] Check all route names correct
- [ ] No duplicate route names
- [ ] No missing routes

### 5.3 Test Routes

- [ ] Test public routes work (no auth)
- [ ] Test user routes work (with auth)
- [ ] Test redirects work
- [ ] Test 404 pages work

### Git Commit
- [ ] Commit: "refactor: update routes for new controller structure"

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Done  
**Time Spent:** ___ hours

---

## 🧪 FASE 6: Testing & Verification (2-3 jam)

### 6.1 Manual Testing - Public Features

- [ ] **Homepage:**
  - [ ] Page loads without errors
  - [ ] Hero articles display
  - [ ] Top products display
  - [ ] Reviews display
  - [ ] Logo displays correctly
  - [ ] Shop name correct

- [ ] **Product Listing:**
  - [ ] Products load
  - [ ] Filtering by stock status works
  - [ ] Sorting works (newest, price low, price high)
  - [ ] Pagination works
  - [ ] Search works (if implemented)

- [ ] **Product Detail:**
  - [ ] Product page loads
  - [ ] Images display
  - [ ] "Add to Cart" button visible (if logged in)
  - [ ] View count increments
  - [ ] WhatsApp link works

- [ ] **Article Listing:**
  - [ ] Articles load
  - [ ] Pagination works

- [ ] **Article Detail:**
  - [ ] Article page loads
  - [ ] Content displays
  - [ ] View count increments

### 6.2 Manual Testing - User Features (Auth Required)

- [ ] **Authentication:**
  - [ ] Can register new account
  - [ ] Can login
  - [ ] Can logout
  - [ ] Email verification works (if enabled)

- [ ] **Cart:**
  - [ ] Can add product to cart
  - [ ] Can view cart
  - [ ] Cart items display correctly
  - [ ] Can update quantity
  - [ ] Can remove item
  - [ ] Can clear cart
  - [ ] Totals calculate correctly

- [ ] **Review:**
  - [ ] Can submit review
  - [ ] Validation works (required fields)
  - [ ] Honeypot blocks spam
  - [ ] Success message shows
  - [ ] Review pending approval

- [ ] **Profile:**
  - [ ] Can view profile page
  - [ ] Can update name/email
  - [ ] Can update password
  - [ ] Can delete account
  - [ ] Validation works

### 6.3 Manual Testing - Admin Features

- [ ] **Filament Admin:**
  - [ ] Can access `/admin`
  - [ ] Dashboard loads
  - [ ] All resources load (Products, Articles, Reviews, etc.)
  - [ ] Can create/edit/delete records
  - [ ] No broken imports
  - [ ] No errors in console

### 6.4 Error Testing

- [ ] **404 Errors:**
  - [ ] Non-existent product returns 404
  - [ ] Non-existent article returns 404

- [ ] **403 Errors:**
  - [ ] Can't access other user's cart items
  - [ ] Can't update other user's profile

- [ ] **Validation Errors:**
  - [ ] Cart validation shows errors
  - [ ] Review validation shows errors
  - [ ] Profile validation shows errors

### 6.5 Browser Console Check

- [ ] No JavaScript errors in console
- [ ] No Inertia errors
- [ ] No 500 errors in Network tab

### 6.6 Laravel Logs Check

- [ ] Check `storage/logs/laravel.log`
- [ ] No critical errors
- [ ] No warnings (or acceptable warnings only)

### 6.7 Performance Check (Optional)

- [ ] Homepage loads in < 2 seconds
- [ ] Product pages load quickly
- [ ] No N+1 queries (check Laravel Debugbar if installed)

### Git Commit
- [ ] Commit: "test: verify all features work after refactoring"

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Done  
**Time Spent:** ___ hours

---

## 📚 FASE 7: Documentation & Cleanup (1 jam)

### 7.1 Code Documentation

- [ ] Add docblocks to `ShopSettingService`
- [ ] Add docblocks to `ProductService`
- [ ] Add docblocks to `CartService`
- [ ] Add docblocks to `ArticleService`
- [ ] Add docblocks to `ReviewService`
- [ ] Add comments to complex logic

### 7.2 Code Cleanup

- [ ] Run Laravel Pint: `./vendor/bin/pint`
- [ ] Remove unused imports
- [ ] Remove commented code
- [ ] Remove debug statements (`dd()`, `dump()`, `var_dump()`)
- [ ] Remove `ShopSetting::getSettings()` calls if any remain

### 7.3 Update README (Optional)

- [ ] Document new architecture
- [ ] Update folder structure explanation
- [ ] Add note about services layer

### 7.4 Final Verification

- [ ] Review all changed files
- [ ] Check for any missed controllers
- [ ] Check for any missed routes
- [ ] Run `php artisan optimize:clear`
- [ ] Test app one more time

### 7.5 Final Git Commit

```bash
git add .
git commit -m "refactor: complete clean architecture implementation

SUMMARY:
- Implemented service layer for business logic separation
- Created Form Request classes for all validations
- Reorganized controllers (Public/ and User/ namespaces)
- Shared ShopSettings globally via Inertia middleware
- Updated routes to reflect new structure
- Improved testability and maintainability

CHANGES:
- New services: Cart, Product, Article, Review, ShopSetting
- New requests: AddToCart, UpdateCartItem, StoreReview
- Moved: CartController, ProfileController, ReviewController to User/
- Refactored: ProductController, ArticleController, HomeController
- Updated: routes/web.php, HandleInertiaRequests middleware

BENEFITS:
- Thin controllers (single responsibility)
- Reusable business logic
- Better code organization
- Easier to test and maintain
- No breaking changes to frontend"
```

- [ ] Final commit made
- [ ] Push to remote: `git push origin refactor/clean-architecture`

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Done  
**Time Spent:** ___ hours

---

## ✅ COMPLETION CHECKLIST

### Code Quality
- [ ] All controllers are thin (< 50 lines per method ideally)
- [ ] No business logic in controllers
- [ ] All validations in Form Requests
- [ ] All business logic in Services
- [ ] Consistent naming conventions
- [ ] Proper dependency injection used

### Functionality
- [ ] All public features work
- [ ] All user features work
- [ ] All admin features work
- [ ] No regressions (nothing broke)
- [ ] Performance acceptable

### Testing
- [ ] Manual testing complete
- [ ] No errors in logs
- [ ] No JavaScript errors
- [ ] All routes work

### Documentation
- [ ] Code documented
- [ ] README updated (if needed)
- [ ] Git commits descriptive

### Git
- [ ] All changes committed
- [ ] Pushed to remote
- [ ] Ready for PR/merge

---

## 📊 TIME TRACKING

| Fase | Estimated | Actual | Status |
|------|-----------|--------|--------|
| Fase 1: Services | 2-3 hrs | ___ hrs | ⬜ / 🟡 / ✅ |
| Fase 2: Requests | 2-3 hrs | ___ hrs | ⬜ / 🟡 / ✅ |
| Fase 3: Controllers | 3-4 hrs | ___ hrs | ⬜ / 🟡 / ✅ |
| Fase 4: Global Settings | 1-2 hrs | ___ hrs | ⬜ / 🟡 / ✅ |
| Fase 5: Routes | 1 hr | ___ hrs | ⬜ / 🟡 / ✅ |
| Fase 6: Testing | 2-3 hrs | ___ hrs | ⬜ / 🟡 / ✅ |
| Fase 7: Docs | 1 hr | ___ hrs | ⬜ / 🟡 / ✅ |
| **TOTAL** | **12-17 hrs** | **___ hrs** | **___% Done** |

---

## 🎉 REFACTORING COMPLETE!

When all boxes are checked:

**Achievements Unlocked:**
- ✅ Clean Architecture implemented
- ✅ Service Layer complete
- ✅ Controllers are thin and focused
- ✅ Validations centralized in Form Requests
- ✅ Business logic reusable and testable
- ✅ Code is maintainable and scalable
- ✅ Ready for PaiTech rebranding!

**Next Steps:**
1. Get code review (if team)
2. Merge to main branch
3. Deploy to staging
4. Test in staging
5. **Start PaiTech Rebranding!** 🚀

---

**Document Version:** 1.0  
**Last Updated:** 2026-09-20  
**Status:** Ready to Use
