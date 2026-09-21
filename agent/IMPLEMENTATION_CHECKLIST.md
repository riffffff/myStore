# Implementation Checklist - PaiTech Rebranding

Track your progress dengan checklist ini! ✅

---

## 🚀 PRE-IMPLEMENTATION

### Setup & Planning
- [ ] Backup database
- [ ] Create branch: `feature/paitech-rebranding-theme`
- [ ] Review full implementation plan
- [ ] Prepare new PaiTech logo files (light + dark)
- [ ] Prepare new favicon
- [ ] Get stakeholder approval
- [ ] Setup development environment

---

## 📊 FASE 1: Database & Model (3-5 jam)

### Migration
- [ ] Create migration file: `add_theme_colors_to_shop_settings`
- [ ] Add 11 color columns (primary, secondary, accent, etc)
- [ ] Add border_radius column
- [ ] Add font_family column
- [ ] Add dark_mode_enabled column
- [ ] Run migration: `php artisan migrate`
- [ ] Verify columns in database

### Model Updates
- [ ] Update `ShopSetting` model `$fillable` array
- [ ] Add `FONT_MAP` constant with 13 fonts
- [ ] Add `getFontUrl()` method
- [ ] Add `getFontFamily()` method
- [ ] Add `getThemeColors()` method
- [ ] Update `applyDefaults()` - change shop_name to 'PaiTech'
- [ ] Update default whatsapp_template with PaiTech
- [ ] Test in tinker: `ShopSetting::getSettings()->getThemeColors()`

### Git Commit
- [ ] Commit: "feat: add theme customization to database and model"

**Estimated: 3-5 hours** ⏱️

---

## 🎨 FASE 2: Filament Admin Panel (3-4 jam)

### ShopSettingResource Updates
- [ ] Add `use ColorPicker` import
- [ ] Add `use Tabs` import
- [ ] Create new Tab: "Theme Colors"
- [ ] Add Section: "Primary Colors" (3 color pickers)
- [ ] Add Section: "Background Colors" (2 color pickers)
- [ ] Add Section: "Text Colors" (2 color pickers)
- [ ] Add Section: "Status Colors" (4 color pickers)
- [ ] Add Section: "Style Options" (border radius, font, dark mode)
- [ ] Add helper text untuk setiap field
- [ ] Set proper default values

### Testing
- [ ] Login to admin panel (/admin)
- [ ] Navigate to Shop Settings
- [ ] Verify "Theme Colors" tab exists
- [ ] Test color pickers (open, select color, save)
- [ ] Test font dropdown (searchable, all options present)
- [ ] Test border radius dropdown
- [ ] Test dark mode toggle
- [ ] Save settings
- [ ] Reload page - verify settings persisted
- [ ] Check database - verify values saved

### Git Commit
- [ ] Commit: "feat: add theme customization UI in Filament"

**Estimated: 3-4 hours** ⏱️

---

## ⚛️ FASE 3: Frontend - React/Inertia (14-18 jam)

### 3.1 Theme Context (2-3 jam)
- [ ] Create `resources/js/Contexts/ThemeContext.tsx`
- [ ] Define `ThemeColors` interface
- [ ] Define `ThemeContextType` interface
- [ ] Create `ThemeProvider` component
- [ ] Create `useTheme()` hook
- [ ] Test theme context in a component

### 3.2 App Layout Updates (2-3 jam)
- [ ] Edit `resources/js/Layouts/AppLayout.tsx`
- [ ] Import ThemeProvider
- [ ] Wrap app with ThemeProvider
- [ ] Inject CSS variables to `:root` in useEffect
- [ ] Handle dark mode class toggle
- [ ] Test CSS variables in browser DevTools

### 3.3 Google Fonts Setup (2-3 jam)
- [ ] Update `resources/views/app.blade.php`
- [ ] Add preconnect links for Google Fonts
- [ ] Add dynamic font link injection
- [ ] Pass `$settings` to blade view
- [ ] Test font loading (check Network tab)
- [ ] Verify fallback fonts work

### 3.4 TailwindCSS Config (1-2 jam)
- [ ] Update `tailwind.config.js`
- [ ] Set `darkMode: 'class'`
- [ ] Extend colors with CSS variables
- [ ] Extend borderRadius with CSS variable
- [ ] Extend fontFamily with CSS variable
- [ ] Rebuild: `npm run build`
- [ ] Test custom classes in components

### 3.5 Component Updates (6-8 jam) ⚠️ **LONGEST TASK**
- [ ] `Layouts/AppLayout.tsx` - Apply theme classes + font
- [ ] `Components/Header.tsx` - Replace hardcoded colors
- [ ] `Components/Footer.tsx` - Replace hardcoded colors
- [ ] `Components/Button.tsx` - Use theme colors
- [ ] `Components/Card.tsx` - Use theme colors
- [ ] `Pages/Home.tsx` - Hero section + featured products
- [ ] `Pages/Products/Index.tsx` - Product listing
- [ ] `Pages/Products/Show.tsx` - Product detail
- [ ] `Pages/Articles/Index.tsx` - Article listing
- [ ] `Pages/Articles/Show.tsx` - Article detail
- [ ] `Pages/Auth/*.tsx` - Login, Register pages
- [ ] `Pages/Profile/*.tsx` - Profile pages
- [ ] All other pages - systematic search & replace

**Search & Replace Checklist:**
- [ ] `bg-blue-500` → `bg-primary`
- [ ] `hover:bg-blue-600` → `hover:bg-primary/90`
- [ ] `text-blue-500` → `text-primary`
- [ ] `bg-white` → `bg-bg-main dark:bg-bg-dark`
- [ ] `text-gray-900` → `text-main`
- [ ] `text-gray-600` → `text-light`
- [ ] `rounded-lg` → `rounded-theme`
- [ ] `font-sans` → `font-theme`

### 3.6 Inertia Middleware (1-2 jam)
- [ ] Edit `app/Http/Middleware/HandleInertiaRequests.php`
- [ ] Update `share()` method
- [ ] Add `shopSettings` data
- [ ] Add `theme` data (all colors + options)
- [ ] Test in React component: `usePage().props.theme`

### Git Commits
- [ ] Commit: "feat: add theme context and provider"
- [ ] Commit: "feat: inject CSS variables and Google Fonts"
- [ ] Commit: "feat: update TailwindCSS config for theme"
- [ ] Commit: "feat: apply theme to all components"
- [ ] Commit: "feat: share theme data via Inertia"

**Estimated: 14-18 hours** ⏱️

---

## 🏷️ FASE 4: Rebranding (4-6 jam)

### 4.1 Database Content (1 jam)
- [ ] Update shop_name in database: 'PaiTech'
- [ ] Update description in database
- [ ] Search articles content for "Agus Gerobak"
- [ ] Search products description for "Agus Gerobak"
- [ ] Replace if found
- [ ] Run seeder/migration if created

### 4.2 Code Files (2-3 jam)
- [ ] Update `.env` - `APP_NAME=PaiTech`
- [ ] Update `config/app.php` - name
- [ ] Search all `.php` files for "Agus Gerobak"
- [ ] Search all `.tsx` files for "Agus Gerobak"
- [ ] Search all `.ts` files for "Agus Gerobak"
- [ ] Search all `.blade.php` files for "Agus Gerobak"
- [ ] Replace with "PaiTech"
- [ ] Search for "agus_gerobak" (snake_case)
- [ ] Replace with "paitech"
- [ ] Search for "agus-gerobak" (kebab-case)
- [ ] Replace with "paitech"
- [ ] Manual review of all replacements

**Search Command:**
```bash
grep -r "Agus Gerobak" --include="*.php" --include="*.tsx" --include="*.ts" .
```

### 4.3 Assets & Static Files (1-2 jam)
- [ ] Replace logo di `public/storage/logo/logo.jpeg`
- [ ] Replace dark logo di `public/storage/logo/logo-dark.jpeg`
- [ ] Replace favicon di `public/storage/logo/favicon.png`
- [ ] Update hero banner jika ada branding
- [ ] Clear cached assets: `php artisan cache:clear`
- [ ] Rebuild frontend: `npm run build`

### Git Commit
- [ ] Commit: "refactor: rebrand from Agus Gerobak to PaiTech"

**Estimated: 4-6 hours** ⏱️

---

## 🧪 FASE 5: Testing & QA (6-8 jam)

### 5.1 Functional Testing (3-4 jam)
- [ ] **Admin Panel:**
  - [ ] Login to /admin
  - [ ] Navigate to Shop Settings > Theme Colors
  - [ ] Change primary color → Save → Verify frontend updates
  - [ ] Change font → Save → Verify font applies
  - [ ] Change border radius → Save → Verify corners update
  - [ ] Toggle dark mode off → Save → Verify dark mode hidden
  - [ ] Clear cache: `php artisan cache:clear`
  - [ ] Verify changes persist after cache clear

- [ ] **Frontend - All Pages:**
  - [ ] Homepage - Hero, featured products
  - [ ] Product listing page
  - [ ] Product detail page (click on product)
  - [ ] Article listing page
  - [ ] Article detail page (click on article)
  - [ ] Cart page (if exists)
  - [ ] Login page
  - [ ] Register page
  - [ ] Profile page
  - [ ] Search functionality

- [ ] **Theme Application:**
  - [ ] Verify primary color applied to buttons
  - [ ] Verify background colors correct
  - [ ] Verify text colors readable
  - [ ] Verify font applied globally
  - [ ] Verify border radius consistent
  - [ ] Test dark mode toggle (if enabled)
  - [ ] Check contrast ratios (accessibility)

- [ ] **Branding:**
  - [ ] No "Agus Gerobak" text found anywhere
  - [ ] "PaiTech" appears in header
  - [ ] "PaiTech" appears in footer
  - [ ] "PaiTech" appears in page titles
  - [ ] New logo displays correctly
  - [ ] Favicon shows in browser tab

### 5.2 Cross-Browser Testing (2 jam)
- [ ] **Chrome/Edge:** Test all pages
- [ ] **Firefox:** Test all pages
- [ ] **Safari:** Test all pages (if available)
- [ ] **Mobile Chrome:** Test responsive
- [ ] **Mobile Safari:** Test responsive (if available)

**Test Checklist per Browser:**
- [ ] Theme colors apply correctly
- [ ] Font loads and displays
- [ ] Dark mode works (if enabled)
- [ ] No console errors
- [ ] No layout breaks

### 5.3 Performance Testing (1-2 jam)
- [ ] Check page load times (< 3s ideal)
- [ ] Verify CSS variables don't slow rendering
- [ ] Check Google Fonts loading time
- [ ] Test cache mechanism: `ShopSetting::getSettings()`
- [ ] Lighthouse audit (aim for 90+ performance)
- [ ] Check Network waterfall for font loading
- [ ] Verify font display: swap (no FOIT)

### 5.4 Regression Testing (1 jam)
- [ ] Existing features still work (products, articles, cart)
- [ ] Admin panel other features work
- [ ] Authentication works
- [ ] Form submissions work
- [ ] Image uploads work
- [ ] WhatsApp links work
- [ ] No PHP errors in logs
- [ ] No JavaScript errors in console

### Git Commit
- [ ] Commit: "test: verify theme system and rebranding"

**Estimated: 6-8 hours** ⏱️

---

## 📚 FASE 6: Documentation & Deployment (4-6 jam)

### 6.1 Documentation (2-3 jam)
- [ ] Update `README.md` with project name
- [ ] Update `README.md` with theme feature info
- [ ] Create/Update `THEME_CUSTOMIZATION.md`
- [ ] Document admin usage instructions
- [ ] Document available fonts
- [ ] Document color scheme
- [ ] Add screenshots of admin panel
- [ ] Add screenshots of frontend
- [ ] Document troubleshooting steps

### 6.2 Code Comments (1 jam)
- [ ] Add docblocks to theme methods in ShopSetting
- [ ] Add comments to ThemeContext
- [ ] Add comments to font mapping
- [ ] Add comments to CSS variable injection

### 6.3 Deployment Preparation (2-3 jam)

**Pre-Deployment Checklist:**
- [ ] All tests passing
- [ ] No console errors
- [ ] No PHP errors
- [ ] Database migrations ready
- [ ] Seeder ready (if needed)
- [ ] Environment variables documented
- [ ] Backup production database

**Staging Deployment:**
- [ ] Deploy to staging environment
- [ ] Run migrations: `php artisan migrate --force`
- [ ] Run seeders: `php artisan db:seed`
- [ ] Build assets: `npm run build`
- [ ] Clear caches
- [ ] Test thoroughly in staging
- [ ] Get stakeholder approval

**Production Deployment:**
```bash
# Deployment script
php artisan down
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan db:seed --class=ThemeSettingSeeder # if exists
npm ci
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link
php artisan cache:clear
php artisan up
```

- [ ] Put site in maintenance mode
- [ ] Pull latest code
- [ ] Install dependencies
- [ ] Run migrations
- [ ] Build frontend assets
- [ ] Cache configs
- [ ] Clear old caches
- [ ] Bring site back online
- [ ] Monitor for errors (next 30 minutes)
- [ ] Verify theme works in production
- [ ] Test critical user flows

### Git Commits
- [ ] Commit: "docs: update documentation for PaiTech and theme system"
- [ ] Merge to main: Create PR and get review
- [ ] Tag release: `git tag v2.0.0` (or appropriate version)

**Estimated: 4-6 hours** ⏱️

---

## ✅ FINAL VERIFICATION

### Post-Deployment Checklist
- [ ] Production site loads without errors
- [ ] Theme colors apply correctly
- [ ] Fonts load correctly
- [ ] PaiTech branding visible everywhere
- [ ] No "Agus Gerobak" references visible
- [ ] Admin panel accessible and functional
- [ ] Theme changes in admin reflect on frontend
- [ ] Mobile responsive works
- [ ] All major features functional
- [ ] Performance acceptable (Lighthouse > 80)
- [ ] No critical errors in logs

### Success Metrics
- [ ] **Functionality:** 100% - All features work
- [ ] **Rebranding:** 100% - No old brand references
- [ ] **Theme System:** 100% - Admin can customize colors/fonts
- [ ] **Performance:** Acceptable - No significant slowdown
- [ ] **User Experience:** Good - No broken layouts
- [ ] **Accessibility:** Adequate - Color contrast passes

---

## 📊 TOTAL PROGRESS

### Time Tracking

| Fase | Estimated | Actual | Status |
|------|-----------|--------|--------|
| Fase 1: Database | 3-5 hrs | ___ hrs | ⬜ Not Started / 🟡 In Progress / ✅ Done |
| Fase 2: Admin Panel | 3-4 hrs | ___ hrs | ⬜ Not Started / 🟡 In Progress / ✅ Done |
| Fase 3: Frontend | 14-18 hrs | ___ hrs | ⬜ Not Started / 🟡 In Progress / ✅ Done |
| Fase 4: Rebranding | 4-6 hrs | ___ hrs | ⬜ Not Started / 🟡 In Progress / ✅ Done |
| Fase 5: Testing | 6-8 hrs | ___ hrs | ⬜ Not Started / 🟡 In Progress / ✅ Done |
| Fase 6: Docs & Deploy | 4-6 hrs | ___ hrs | ⬜ Not Started / 🟡 In Progress / ✅ Done |
| **TOTAL** | **34-47 hrs** | **___ hrs** | **___% Complete** |

---

## 🎉 PROJECT COMPLETE!

**When all checkboxes are ✅:**

Congratulations! PaiTech rebranding dan theme customization system berhasil diimplementasikan! 🚀

**Deliverables:**
- ✅ Website rebranded to PaiTech
- ✅ Dynamic theme customization system
- ✅ Admin can change colors, fonts, border radius
- ✅ Dark mode support (optional)
- ✅ 13 Google Fonts to choose from
- ✅ All features working
- ✅ Fully tested and deployed

**Next Steps:**
- Monitor user feedback
- Gather analytics
- Plan Phase 2 enhancements (if needed)
- Celebrate! 🎊

---

**Document Version:** 1.0  
**Last Updated:** 2026-09-20  
**Status:** Ready for Implementation
