# Implementation Plan: Rebranding "Agus Gerobak" → "PaiTech" + Theme Customization System

## 📋 Ringkasan Proyek

Perombakan besar aplikasi e-commerce dengan dua tujuan utama:
1. **Rebranding lengkap** dari "Agus Gerobak" menjadi "PaiTech"
2. **Theme Customization System** - Admin dapat mengatur warna dasar website (background, primary color, accent color, dll)

---

## 🎯 Tujuan dan Scope

### Tujuan Utama:
- Mengganti semua referensi "Agus Gerobak" menjadi "PaiTech" di seluruh codebase
- Membuat sistem tema dinamis yang dapat dikustomisasi admin
- Admin dapat mengatur warna background, primary, secondary, text, dan elemen UI lainnya
- Tema disimpan di database dan diterapkan secara real-time tanpa rebuild

### Out of Scope:
- Perubahan fungsionalitas bisnis logic yang sudah ada
- Penambahan fitur baru selain theme customization

---

## 📦 Technology Stack

**Backend:**
- Laravel 13.8
- Filament 3.3 (Admin Panel)
- PHP 8.3

**Frontend:**
- React 19
- Inertia.js 2.0
- TailwindCSS 4.0
- TypeScript 5.7
- Vite 8.0

**Database:**
- SQLite (development)
- MySQL/PostgreSQL compatible

---

## 🗂️ Fase Implementasi

## **FASE 1: Database & Model Updates**

### 1.1 Update ShopSetting Model & Migration
**File:** `database/migrations/XXXX_add_theme_colors_to_shop_settings.php`

**Kolom baru yang ditambahkan:**
```php
// Theme Colors
$table->string('theme_primary_color')->default('#3B82F6'); // Blue-500
$table->string('theme_secondary_color')->default('#8B5CF6'); // Violet-500
$table->string('theme_accent_color')->default('#F59E0B'); // Amber-500
$table->string('theme_background_color')->default('#FFFFFF'); // White
$table->string('theme_background_dark_color')->default('#111827'); // Gray-900
$table->string('theme_text_color')->default('#1F2937'); // Gray-800
$table->string('theme_text_light_color')->default('#6B7280'); // Gray-500
$table->string('theme_success_color')->default('#10B981'); // Green-500
$table->string('theme_error_color')->default('#EF4444'); // Red-500
$table->string('theme_warning_color')->default('#F59E0B'); // Amber-500
$table->string('theme_info_color')->default('#3B82F6'); // Blue-500

// Additional Theme Options
$table->string('theme_border_radius')->default('0.5rem'); // 8px
$table->string('theme_font_family')->default('inter'); // Font slug
$table->boolean('theme_dark_mode_enabled')->default(true);
```

**Tasks:**
- [ ] Buat migration baru untuk menambah kolom theme
- [ ] Update model `ShopSetting.php` - tambahkan kolom ke `$fillable`
- [ ] Update method `applyDefaults()` untuk set default theme colors
- [ ] Tambahkan method baru `getThemeColors()` yang return array colors
- [ ] Update method `getSettings()` untuk include theme data di cache

**Estimasi:** 2-3 jam

---

### 1.2 Update Default Values & Seeds
**File:** `app/Models/ShopSetting.php`

**Changes:**
```php
// Update default shop_name
'shop_name' => 'PaiTech'

// Update default description
'description' => 'Solusi teknologi dan produk berkualitas untuk kebutuhan bisnis modern'

// Update whatsapp_template
'whatsapp_template' => 'Halo PaiTech, saya tertarik dengan produk *{product_name}* seharga {product_price}. Apakah tersedia?'
```

**Tasks:**
- [ ] Update semua default values di model
- [ ] Buat seeder baru `ThemeSettingSeeder.php` untuk populate theme colors
- [ ] Update existing data di database dengan command/seeder

**Estimasi:** 1-2 jam

---

## **FASE 2: Backend - Filament Admin Panel Updates**

### 2.1 Update ShopSettingResource
**File:** `app/Filament/Resources/ShopSettingResource.php`

**Tasks:**
- [ ] Update form schema - tambahkan section "Theme Customization"
- [ ] Gunakan `ColorPicker` component untuk semua theme colors
- [ ] Tambahkan `Select` untuk border radius options
- [ ] Tambahkan `TextInput` untuk font family
- [ ] Tambahkan `Toggle` untuk dark mode
- [ ] Tambahkan preview panel (real-time preview theme colors)
- [ ] Group theme settings dalam Tabs atau Section

**Form Structure:**
```php
Forms\Components\Tabs::make('Settings')
    ->tabs([
        // Tab 1: Shop Information (existing)
        Tabs\Tab::make('Shop Information')
            ->schema([...]),
        
        // Tab 2: Contact & WhatsApp (existing)
        Tabs\Tab::make('Contact')
            ->schema([...]),
        
        // Tab 3: Theme Customization (NEW)
        Tabs\Tab::make('Theme Colors')
            ->schema([
                Section::make('Primary Colors')
                    ->schema([
                        ColorPicker::make('theme_primary_color'),
                        ColorPicker::make('theme_secondary_color'),
                        ColorPicker::make('theme_accent_color'),
                    ])->columns(3),
                
                Section::make('Background Colors')
                    ->schema([
                        ColorPicker::make('theme_background_color'),
                        ColorPicker::make('theme_background_dark_color'),
                    ])->columns(2),
                
                Section::make('Text Colors')
                    ->schema([
                        ColorPicker::make('theme_text_color'),
                        ColorPicker::make('theme_text_light_color'),
                    ])->columns(2),
                
                Section::make('Status Colors')
                    ->schema([
                        ColorPicker::make('theme_success_color'),
                        ColorPicker::make('theme_error_color'),
                        ColorPicker::make('theme_warning_color'),
                        ColorPicker::make('theme_info_color'),
                    ])->columns(4),
                
                Section::make('Additional Options')
                    ->schema([
                        Select::make('theme_border_radius')
                            ->label('Border Radius')
                            ->options([
                                '0' => 'None (Sharp)',
                                '0.25rem' => 'Small (4px)',
                                '0.5rem' => 'Medium (8px)',
                                '0.75rem' => 'Large (12px)',
                                '1rem' => 'Extra Large (16px)',
                                '1.5rem' => 'Rounded (24px)',
                            ])
                            ->default('0.5rem'),
                        
                        Select::make('theme_font_family')
                            ->label('Font Family')
                            ->options([
                                'inter' => 'Inter (Modern, Clean)',
                                'roboto' => 'Roboto (Google Default)',
                                'poppins' => 'Poppins (Rounded, Friendly)',
                                'montserrat' => 'Montserrat (Geometric)',
                                'open-sans' => 'Open Sans (Neutral)',
                                'lato' => 'Lato (Corporate)',
                                'raleway' => 'Raleway (Elegant)',
                                'nunito' => 'Nunito (Soft, Rounded)',
                                'source-sans' => 'Source Sans Pro (Adobe)',
                                'work-sans' => 'Work Sans (Technical)',
                                'playfair' => 'Playfair Display (Serif, Elegant)',
                                'merriweather' => 'Merriweather (Serif, Readable)',
                                'system' => 'System Default (Native)',
                            ])
                            ->default('inter')
                            ->searchable()
                            ->helperText('Choose a font that matches your brand identity'),
                        
                        Toggle::make('theme_dark_mode_enabled')
                            ->label('Enable Dark Mode')
                            ->helperText('Allow users to switch to dark theme'),
                    ])->columns(3),
            ]),
        
        // Tab 4: Logos & Images (existing)
        Tabs\Tab::make('Branding')
            ->schema([...]),
    ])
```

**Tasks:**
- [ ] Implementasi form schema lengkap
- [ ] Tambahkan validation rules untuk hex color
- [ ] Tambahkan helper text untuk setiap field
- [ ] Test CRUD operations

**Estimasi:** 3-4 jam

---

### 2.2 Create Theme Preview Widget (Optional)
**File:** `app/Filament/Widgets/ThemePreviewWidget.php`

**Tasks:**
- [ ] Buat widget view untuk preview theme di admin panel
- [ ] Show sample buttons, cards, text dengan theme colors
- [ ] Auto-refresh saat theme colors berubah

**Estimasi:** 2-3 jam (optional)

---

## **FASE 3: Frontend - React/Inertia Updates**

### 3.1 Create Theme Context & Provider
**File:** `resources/js/Contexts/ThemeContext.tsx`

**Tasks:**
- [ ] Buat React Context untuk theme
- [ ] Store theme colors dari server (via Inertia props)
- [ ] Provide theme colors ke seluruh aplikasi
- [ ] Handle dark mode toggle

**Implementation:**
```typescript
interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundDark: string;
    text: string;
    textLight: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    borderRadius: string;
    fontFamily: string;
}

interface ThemeContextType {
    colors: ThemeColors;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}
```

**Estimasi:** 2-3 jam

---

### 3.2 Update App Layout - Inject CSS Variables
**File:** `resources/js/Layouts/AppLayout.tsx`

**Tasks:**
- [ ] Wrap app dengan ThemeProvider
- [ ] Inject CSS variables ke `<html>` atau `<body>`
- [ ] Apply theme colors as CSS custom properties
- [ ] Handle dark mode class toggle

**Implementation:**
```tsx
// In AppLayout
useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme colors as CSS variables
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-bg', theme.colors.background);
    root.style.setProperty('--color-bg-dark', theme.colors.backgroundDark);
    // ... dst
    
    root.style.setProperty('--border-radius', theme.colors.borderRadius);
    root.style.setProperty('--font-family', theme.colors.fontFamily);
    
    // Toggle dark mode class
    if (theme.isDarkMode) {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}, [theme]);
```

**Estimasi:** 2-3 jam

---

### 3.3 Setup Google Fonts Loading
**File:** `resources/views/app.blade.php` & Theme utilities

**Available Fonts (Google Fonts):**
```php
// Font mapping configuration
const FONT_MAP = [
    'inter' => [
        'name' => 'Inter',
        'url' => 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        'fallback' => 'system-ui, -apple-system, sans-serif',
    ],
    'roboto' => [
        'name' => 'Roboto',
        'url' => 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
        'fallback' => 'Arial, sans-serif',
    ],
    'poppins' => [
        'name' => 'Poppins',
        'url' => 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
        'fallback' => 'system-ui, sans-serif',
    ],
    'montserrat' => [
        'name' => 'Montserrat',
        'url' => 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap',
        'fallback' => 'Arial, sans-serif',
    ],
    'open-sans' => [
        'name' => 'Open Sans',
        'url' => 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap',
        'fallback' => 'Arial, sans-serif',
    ],
    'lato' => [
        'name' => 'Lato',
        'url' => 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
        'fallback' => 'Arial, sans-serif',
    ],
    'raleway' => [
        'name' => 'Raleway',
        'url' => 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap',
        'fallback' => 'Arial, sans-serif',
    ],
    'nunito' => [
        'name' => 'Nunito',
        'url' => 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap',
        'fallback' => 'system-ui, sans-serif',
    ],
    'source-sans' => [
        'name' => 'Source Sans Pro',
        'url' => 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap',
        'fallback' => 'Arial, sans-serif',
    ],
    'work-sans' => [
        'name' => 'Work Sans',
        'url' => 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700&display=swap',
        'fallback' => 'system-ui, sans-serif',
    ],
    'playfair' => [
        'name' => 'Playfair Display',
        'url' => 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
        'fallback' => 'Georgia, serif',
    ],
    'merriweather' => [
        'name' => 'Merriweather',
        'url' => 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap',
        'fallback' => 'Georgia, serif',
    ],
    'system' => [
        'name' => 'System Default',
        'url' => null, // No external font
        'fallback' => 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    ],
];
```

**Tasks:**
- [ ] Buat helper function `getFontUrl()` di ShopSetting model
- [ ] Buat helper function `getFontFamily()` untuk full CSS font-family string
- [ ] Update `app.blade.php` untuk inject Google Fonts link dinamis
- [ ] Add font preconnect untuk performance

**Implementation di app.blade.php:**
```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>{{ config('app.name', 'PaiTech') }}</title>

    <!-- Favicon -->
    <link rel="icon" href="{{ $settings->getFaviconUrl() }}" type="image/x-icon">

    <!-- Preconnect to Google Fonts for performance -->
    @if($settings->getFontUrl())
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="{{ $settings->getFontUrl() }}" rel="stylesheet">
    @endif

    <!-- Scripts & Styles -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
```

**Add methods to ShopSetting model:**
```php
// Font mapping - bisa juga di config file
private const FONT_MAP = [
    'inter' => [
        'name' => 'Inter',
        'url' => 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        'fallback' => 'system-ui, -apple-system, sans-serif',
    ],
    // ... dst (copy dari atas)
];

public function getFontUrl(): ?string
{
    $fontSlug = $this->theme_font_family ?? 'inter';
    return self::FONT_MAP[$fontSlug]['url'] ?? null;
}

public function getFontFamily(): string
{
    $fontSlug = $this->theme_font_family ?? 'inter';
    $fontData = self::FONT_MAP[$fontSlug] ?? self::FONT_MAP['inter'];
    
    if ($fontData['url']) {
        return "'{$fontData['name']}', {$fontData['fallback']}";
    }
    
    return $fontData['fallback'];
}
```

**Estimasi:** 2-3 jam

---

### 3.4 Update TailwindCSS Configuration
**File:** `tailwind.config.js`

**Tasks:**
- [ ] Extend theme dengan CSS variables
- [ ] Map TailwindCSS colors ke custom CSS variables
- [ ] Configure dark mode strategy
- [ ] Setup font-family dengan CSS variable

**Implementation:**
```javascript
export default {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                accent: 'var(--color-accent)',
                'bg-main': 'var(--color-bg)',
                'bg-dark': 'var(--color-bg-dark)',
                'text-main': 'var(--color-text)',
                'text-light': 'var(--color-text-light)',
                success: 'var(--color-success)',
                error: 'var(--color-error)',
                warning: 'var(--color-warning)',
                info: 'var(--color-info)',
            },
            borderRadius: {
                theme: 'var(--border-radius)',
            },
            fontFamily: {
                theme: 'var(--font-family)',
                // Still keep default sans/serif for fallback
                sans: ['var(--font-family)', 'system-ui', 'sans-serif'],
            }
        }
    }
}
```

**Estimasi:** 1-2 jam

---

### 3.5 Update All React Components - Apply Theme Classes
**Files:** `resources/js/Components/**/*.tsx`, `resources/js/Pages/**/*.tsx`

**Tasks:**
- [ ] Replace hardcoded Tailwind colors dengan theme classes
- [ ] Update semua `bg-blue-500` → `bg-primary`
- [ ] Update semua `text-gray-800` → `text-main`
- [ ] Update semua `rounded-lg` → `rounded-theme`
- [ ] Search & replace sistematis

**Priority Components:**
1. `Layouts/AppLayout.tsx` - Main layout
2. `Components/Header.tsx` - Navigation
3. `Components/Footer.tsx`
4. `Components/Button.tsx` - Reusable button
5. `Components/Card.tsx` - Product/Article cards
6. `Pages/Home.tsx` - Hero section, featured products
7. `Pages/Products/*.tsx` - Product listing & detail
8. `Pages/Articles/*.tsx` - Article listing & detail

**Search & Replace Patterns:**
```bash
# Example replacements needed
bg-white → bg-bg-main dark:bg-bg-dark
bg-gray-100 → bg-gray-100 (or custom)
text-gray-900 → text-main
text-gray-600 → text-light
bg-blue-500 → bg-primary
hover:bg-blue-600 → hover:bg-primary/90
text-blue-500 → text-primary
border-gray-300 → border-gray-300 (or custom)
```

**Estimasi:** 6-8 jam (tedious but critical)

---

### 3.5 Share Theme Data via Inertia
**File:** `app/Http/Middleware/HandleInertiaRequests.php`

**Tasks:**
- [ ] Update `share()` method
- [ ] Include theme colors dari ShopSetting
- [ ] Include shop settings (logo, name, dll)

**Implementation:**
```php
public function share(Request $request): array
{
    $settings = ShopSetting::getSettings();
    
    return array_merge(parent::share($request), [
        'shopSettings' => [
            'name' => $settings->shop_name,
            'logo' => $settings->getLogoUrl('light'),
            'logoDark' => $settings->getLogoUrl('dark'),
            'favicon' => $settings->getFaviconUrl(),
            'whatsapp' => $settings->whatsapp_number,
            // ... other settings
        ],
        'theme' => [
            'primary' => $settings->theme_primary_color,
            'secondary' => $settings->theme_secondary_color,
            'accent' => $settings->theme_accent_color,
            'background' => $settings->theme_background_color,
            'backgroundDark' => $settings->theme_background_dark_color,
            'text' => $settings->theme_text_color,
            'textLight' => $settings->theme_text_light_color,
            'success' => $settings->theme_success_color,
            'error' => $settings->theme_error_color,
            'warning' => $settings->theme_warning_color,
            'info' => $settings->theme_info_color,
            'borderRadius' => $settings->theme_border_radius,
            'fontFamily' => $settings->theme_font_family,
            'darkModeEnabled' => $settings->theme_dark_mode_enabled,
        ],
    ]);
}
```

**Estimasi:** 1-2 jam

---

## **FASE 4: Rebranding - Search & Replace**

### 4.1 Database Content Updates
**Tasks:**
- [ ] Update shop_name di shop_settings table
- [ ] Update semua mentions "Agus Gerobak" di articles/products jika ada
- [ ] Create migration/seeder untuk update data

**SQL Examples:**
```sql
UPDATE shop_settings SET shop_name = 'PaiTech' WHERE id = 1;
UPDATE articles SET content = REPLACE(content, 'Agus Gerobak', 'PaiTech');
UPDATE products SET description = REPLACE(description, 'Agus Gerobak', 'PaiTech');
```

**Estimasi:** 1 jam

---

### 4.2 Code & Configuration Files
**Search & Replace in Files:**

| Old Value | New Value | Files Affected |
|-----------|-----------|----------------|
| `Agus Gerobak` | `PaiTech` | All `.php`, `.tsx`, `.ts`, `.blade.php` |
| `agus_gerobak` | `paitech` | Variable names, slugs |
| `agus-gerobak` | `paitech` | URLs, CSS classes |
| `AgusGerobak` | `PaiTech` | Class names (if any) |

**Critical Files to Update:**
1. `.env` - APP_NAME
2. `config/app.php` - name
3. `package.json` - name (optional)
4. `composer.json` - name/description (optional)
5. All text dalam `resources/js/Pages/**/*.tsx`
6. Meta tags di `resources/views/app.blade.php`
7. SEO metadata

**Tasks:**
- [ ] Global search & replace dengan regex
- [ ] Manual review hasil replacement
- [ ] Test semua halaman untuk missed replacements

**Tools:**
```bash
# Find all occurrences
grep -r "Agus Gerobak" --include="*.php" --include="*.tsx" --include="*.ts" .

# Replace in files (careful!)
find . -type f \( -name "*.php" -o -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's/Agus Gerobak/PaiTech/g' {} +
```

**Estimasi:** 2-3 jam

---

### 4.3 Assets & Static Files
**Tasks:**
- [ ] Replace logo files di `public/storage/logo/`
- [ ] Update logo.jpeg → paitech-logo.jpeg (optional)
- [ ] Update favicon
- [ ] Update hero banners jika ada branding
- [ ] Clear cached assets

**Estimasi:** 1-2 jam

---

## **FASE 5: Testing & Quality Assurance**

### 5.1 Functional Testing
**Test Cases:**
- [ ] Admin dapat mengubah theme colors via Filament
- [ ] Theme colors diterapkan di frontend setelah save
- [ ] Cache invalidation bekerja (perubahan langsung terlihat)
- [ ] Dark mode toggle berfungsi
- [ ] Semua halaman apply theme colors dengan benar
- [ ] Responsive design tetap baik dengan theme baru
- [ ] Logo dan branding PaiTech muncul di semua halaman

**Pages to Test:**
- [ ] Homepage (hero section, featured products)
- [ ] Product listing page
- [ ] Product detail page
- [ ] Article listing page
- [ ] Article detail page
- [ ] Cart page (if exists)
- [ ] Auth pages (login, register)
- [ ] Profile page
- [ ] Admin panel (Filament)

**Estimasi:** 3-4 jam

---

### 5.2 Cross-Browser Testing
**Browsers:**
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if possible)
- [ ] Mobile browsers (Chrome Mobile, Safari iOS)

**Estimasi:** 2 jam

---

### 5.3 Performance Testing
**Tasks:**
- [ ] Verify cache mechanism bekerja (ShopSettings)
- [ ] Check page load times (CSS variables tidak slow down)
- [ ] Optimize jika perlu

**Estimasi:** 1-2 jam

---

## **FASE 6: Documentation & Deployment**

### 6.1 Documentation
**Create/Update Files:**
- [ ] `README.md` - Update project name dan description
- [ ] `THEME_CUSTOMIZATION.md` - Guide untuk admin cara ubah theme
- [ ] `DEPLOYMENT.md` - Steps untuk deploy dengan theme system
- [ ] Code comments di critical functions

**Estimasi:** 2-3 jam

---

### 6.2 Deployment Preparation
**Tasks:**
- [ ] Run all migrations di production
- [ ] Seed theme defaults
- [ ] Clear all caches (`php artisan cache:clear`, `php artisan config:clear`)
- [ ] Rebuild frontend assets (`npm run build`)
- [ ] Test di staging environment
- [ ] Backup database before deployment

**Checklist:**
```bash
# Deployment commands
php artisan down
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan db:seed --class=ThemeSettingSeeder
npm ci
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link
php artisan cache:clear
php artisan up
```

**Estimasi:** 2-3 jam

---

## 📊 Timeline & Effort Estimation

| Fase | Tasks | Estimasi Waktu | Priority |
|------|-------|----------------|----------|
| **Fase 1: Database & Model** | Migration, Model updates, Seeds | 3-5 jam | HIGH |
| **Fase 2: Filament Admin** | ShopSettingResource, Theme UI | 3-4 jam | HIGH |
| **Fase 3: Frontend - React** | ThemeContext, CSS Variables, Font Loading, Components | 14-18 jam | HIGH |
| **Fase 4: Rebranding** | Search & Replace, Assets | 4-6 jam | HIGH |
| **Fase 5: Testing** | Functional, Browser, Performance | 6-8 jam | HIGH |
| **Fase 6: Documentation** | Docs, Deployment | 4-6 jam | MEDIUM |
| **TOTAL** | | **34-47 jam** | |

**Recommended Schedule:**
- **Week 1:** Fase 1-2 (Backend foundation)
- **Week 2:** Fase 3 (Frontend implementation)
- **Week 3:** Fase 4-5 (Rebranding & Testing)
- **Week 4:** Fase 6 & Buffer (Documentation & Deployment)

---

## 🚨 Risks & Mitigation

### Risk 1: CSS Specificity Issues
**Problem:** Existing hardcoded Tailwind classes might override theme classes
**Mitigation:** 
- Systematic search & replace
- Use `!important` sparingly for CSS variables
- Test thoroughly

### Risk 2: Cache Not Clearing
**Problem:** Theme changes tidak terlihat karena cache
**Mitigation:**
- Implement proper cache invalidation di ShopSetting save()
- Add cache-busting untuk CSS jika perlu
- Document cache clearing commands

### Risk 3: Dark Mode Conflicts
**Problem:** Dark mode classes conflict dengan theme colors
**Mitigation:**
- Use Tailwind's dark: variant consistently
- Test dark mode di semua pages
- Provide toggle yang clear untuk users

### Risk 4: Performance Impact
**Problem:** CSS variables bisa slow down rendering
**Mitigation:**
- Minimize number of CSS variables
- Cache theme data properly
- Monitor performance metrics

### Risk 5: Browser Compatibility
**Problem:** Older browsers might not support CSS variables
**Mitigation:**
- Define fallback colors
- Test di IE11 jika masih perlu support
- Document minimum browser requirements

---

## 📝 Code Quality Standards

**Best Practices:**
1. **Naming Convention:** Gunakan prefix `theme_` untuk semua theme-related columns
2. **Type Safety:** Buat proper TypeScript interfaces untuk theme
3. **Validation:** Validate hex colors di backend (regex: `/^#[0-9A-Fa-f]{6}$/`)
4. **Accessibility:** Ensure color contrast ratios meet WCAG standards
5. **Documentation:** Comment semua theme-related functions
6. **Testing:** Write unit tests untuk ThemeContext dan utility functions

---

## ✅ Definition of Done

**Fase 1-2 (Backend):**
- [ ] Migration applied successfully
- [ ] Model updated dengan theme columns
- [ ] Filament form berfungsi dan save theme colors
- [ ] Cache mechanism working

**Fase 3 (Frontend):**
- [ ] ThemeContext implemented dan working
- [ ] CSS variables injected properly
- [ ] All components use theme classes
- [ ] Dark mode toggle working

**Fase 4 (Rebranding):**
- [ ] No "Agus Gerobak" references found in codebase
- [ ] All logos replaced
- [ ] Database updated

**Fase 5-6 (Final):**
- [ ] All test cases passing
- [ ] Documentation complete
- [ ] Production deployment successful
- [ ] No critical bugs reported

---

## 🔧 Tools & Resources

**Development:**
- VS Code dengan extensions: Tailwind CSS IntelliSense, PHP Intellisor
- Laravel Debugbar untuk debugging
- React DevTools
- Browser DevTools untuk CSS inspection

**Testing:**
- PHPUnit untuk backend tests
- Browser testing tools (Chrome DevTools, Firefox DevTools)
- Lighthouse untuk performance audit

**Deployment:**
- Git untuk version control
- Composer untuk PHP dependencies
- NPM untuk JS dependencies
- Laravel Forge/Envoyer atau manual deployment

---

## 📞 Support & Resources

**Documentation References:**
- [Laravel 13 Docs](https://laravel.com/docs/13.x)
- [Filament 3 Docs](https://filamentphp.com/docs/3.x)
- [TailwindCSS 4 Docs](https://tailwindcss.com/docs)
- [React 19 Docs](https://react.dev)
- [Inertia.js Docs](https://inertiajs.com)

**CSS Variables Guide:**
- [MDN CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [TailwindCSS Custom Properties](https://tailwindcss.com/docs/customizing-colors#using-css-variables)

---

## 🎉 Next Steps

Setelah plan ini approved:

1. **Setup branch baru:** `git checkout -b feature/paitech-rebranding-theme`
2. **Mulai dari Fase 1:** Database & Model updates
3. **Commit frequently** dengan descriptive messages
4. **Daily standup:** Review progress dan blockers
5. **Pull request:** After each phase for review
6. **Final merge:** After all testing passes

---

## 💡 Future Enhancements (Post-Launch)

**Phase 2 Features (Optional):**
1. **Theme Presets:** Provide 5-10 pre-made color schemes
2. **Live Preview:** Real-time preview di Filament admin
3. **Export/Import Themes:** JSON export untuk backup themes
4. **Multiple Themes:** Switch between saved theme variations
5. **Gradient Support:** Allow gradient backgrounds
6. **Custom Font Upload:** Upload custom font files (TTF/WOFF)
7. **More Google Fonts:** Expand font library to 50+ fonts
8. **Advanced CSS:** Custom CSS injection untuk power users
9. **Theme Marketplace:** Share/sell themes (community feature)
10. **Per-Page Theme:** Different themes untuk different pages

---

## 🆔 Technical Notes

### Database IDs
- **shop_settings table:** Tetap pakai integer ID dengan singleton pattern (ID = 1)
- **Semua table lain:** Auto-increment integer IDs (standard Laravel)
- **Tidak perlu UUID** untuk project ini - integer IDs sudah cukup dan lebih performant

### Font Loading Strategy
- **Google Fonts API:** Fonts dimuat via CDN Google (fast, reliable, cached)
- **Font slugs:** Disimpan sebagai string identifier ('inter', 'roboto', dst)
- **Fallback fonts:** Setiap font punya system fallback untuk compatibility
- **Performance:** Font preconnect untuk faster loading
- **System font option:** Untuk users yang ingin native OS fonts

---

**Document Version:** 1.0  
**Created:** 2026-09-20  
**Author:** AI Implementation Plan  
**Status:** Draft - Awaiting Approval  

---

## ✍️ Sign-off

- [ ] **Developer:** Reviewed and understood
- [ ] **Project Manager:** Approved scope and timeline
- [ ] **Designer:** Approved theme approach
- [ ] **Client:** Approved rebranding and features

---

**Ready to start? Let's build PaiTech! 🚀**
