# Architecture Overview - PaiTech Theme System

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN PANEL (Filament)                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ShopSettingResource.php                                    │  │
│  │  - ColorPicker components (11 colors)                      │  │
│  │  - Select dropdown (Font Family - 13 options)              │  │
│  │  - Select dropdown (Border Radius - 6 options)             │  │
│  │  - Toggle (Dark Mode Enable/Disable)                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↓ SAVE                              │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE (SQLite)                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ shop_settings table (Singleton ID=1)                       │  │
│  │  - theme_primary_color: #3B82F6                            │  │
│  │  - theme_secondary_color: #8B5CF6                          │  │
│  │  - theme_accent_color: #F59E0B                             │  │
│  │  - theme_background_color: #FFFFFF                         │  │
│  │  - theme_background_dark_color: #111827                    │  │
│  │  - theme_text_color: #1F2937                               │  │
│  │  - theme_text_light_color: #6B7280                         │  │
│  │  - theme_success_color: #10B981                            │  │
│  │  - theme_error_color: #EF4444                              │  │
│  │  - theme_warning_color: #F59E0B                            │  │
│  │  - theme_info_color: #3B82F6                               │  │
│  │  - theme_border_radius: 0.5rem                             │  │
│  │  - theme_font_family: 'inter'                              │  │
│  │  - theme_dark_mode_enabled: true                           │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                ↓ CACHED (10 min)
┌─────────────────────────────────────────────────────────────────┐
│                       LARAVEL MODEL                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ShopSetting::getSettings()                                 │  │
│  │  - Retrieves from cache or DB                              │  │
│  │  - Returns singleton instance                              │  │
│  │                                                             │  │
│  │ Helper Methods:                                             │  │
│  │  - getThemeColors() → Array of all colors                  │  │
│  │  - getFontUrl() → Google Fonts CDN URL                     │  │
│  │  - getFontFamily() → Full CSS font-family string           │  │
│  │  - getLogoUrl() → Logo URL with fallback                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                ↓ SHARED via Inertia
┌─────────────────────────────────────────────────────────────────┐
│                    INERTIA MIDDLEWARE                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ HandleInertiaRequests::share()                             │  │
│  │  {                                                          │  │
│  │    shopSettings: {                                          │  │
│  │      name: 'PaiTech',                                       │  │
│  │      logo: '/storage/...',                                  │  │
│  │      // ...                                                 │  │
│  │    },                                                       │  │
│  │    theme: {                                                 │  │
│  │      primary: '#3B82F6',                                    │  │
│  │      secondary: '#8B5CF6',                                  │  │
│  │      accent: '#F59E0B',                                     │  │
│  │      background: '#FFFFFF',                                 │  │
│  │      // ... all colors                                      │  │
│  │      fontFamily: 'Inter, system-ui, sans-serif',           │  │
│  │      borderRadius: '0.5rem',                                │  │
│  │      darkModeEnabled: true                                  │  │
│  │    }                                                        │  │
│  │  }                                                          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                ↓ AVAILABLE in React
┌─────────────────────────────────────────────────────────────────┐
│                      REACT FRONTEND                              │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ThemeContext.tsx                                           │  │
│  │  - Receives theme from usePage().props.theme               │  │
│  │  - Provides theme to all components                        │  │
│  │  - Manages dark mode state                                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ AppLayout.tsx                                              │  │
│  │  - Wraps app with ThemeProvider                            │  │
│  │  - Injects CSS variables to :root                          │  │
│  │    document.documentElement.style.setProperty(...)         │  │
│  │                                                             │  │
│  │    :root {                                                  │  │
│  │      --color-primary: #3B82F6;                             │  │
│  │      --color-secondary: #8B5CF6;                           │  │
│  │      --color-accent: #F59E0B;                              │  │
│  │      --color-bg: #FFFFFF;                                  │  │
│  │      --color-bg-dark: #111827;                             │  │
│  │      --color-text: #1F2937;                                │  │
│  │      --color-text-light: #6B7280;                          │  │
│  │      --border-radius: 0.5rem;                              │  │
│  │      --font-family: 'Inter', system-ui, sans-serif;        │  │
│  │    }                                                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ All React Components                                       │  │
│  │  - Use TailwindCSS classes that reference CSS vars         │  │
│  │    className="bg-primary text-white rounded-theme"         │  │
│  │  - Automatically themed!                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                ↓ RENDERED
┌─────────────────────────────────────────────────────────────────┐
│                        BLADE TEMPLATE                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ app.blade.php                                              │  │
│  │  <head>                                                     │  │
│  │    <!-- Preconnect Google Fonts -->                        │  │
│  │    <link rel="preconnect"                                  │  │
│  │          href="https://fonts.googleapis.com">              │  │
│  │                                                             │  │
│  │    <!-- Load Selected Font -->                             │  │
│  │    <link href="{{ $settings->getFontUrl() }}"              │  │
│  │          rel="stylesheet">                                 │  │
│  │                                                             │  │
│  │    <!-- Favicon -->                                        │  │
│  │    <link rel="icon"                                        │  │
│  │          href="{{ $settings->getFaviconUrl() }}">          │  │
│  │  </head>                                                    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                ↓ STYLED BY
┌─────────────────────────────────────────────────────────────────┐
│                      TAILWIND CONFIG                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ tailwind.config.js                                         │  │
│  │  theme: {                                                   │  │
│  │    extend: {                                                │  │
│  │      colors: {                                              │  │
│  │        primary: 'var(--color-primary)',                    │  │
│  │        secondary: 'var(--color-secondary)',                │  │
│  │        accent: 'var(--color-accent)',                      │  │
│  │        'bg-main': 'var(--color-bg)',                       │  │
│  │        'bg-dark': 'var(--color-bg-dark)',                  │  │
│  │        'text-main': 'var(--color-text)',                   │  │
│  │        'text-light': 'var(--color-text-light)',            │  │
│  │      },                                                     │  │
│  │      borderRadius: {                                        │  │
│  │        theme: 'var(--border-radius)',                      │  │
│  │      },                                                     │  │
│  │      fontFamily: {                                          │  │
│  │        theme: 'var(--font-family)',                        │  │
│  │      }                                                      │  │
│  │    }                                                        │  │
│  │  }                                                          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                       USER'S BROWSER                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Fully Themed PaiTech Website! 🎨                           │  │
│  │  - Custom colors applied                                   │  │
│  │  - Selected font loaded                                    │  │
│  │  - Border radius consistent                                │  │
│  │  - Dark mode available (if enabled)                        │  │
│  │  - Fast performance (cached + CDN fonts)                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
Admin Changes Theme
        ↓
Filament Form Submit
        ↓
Laravel Controller saves to DB (shop_settings)
        ↓
Cache cleared (ShopSetting::flushCache)
        ↓
Next page request...
        ↓
ShopSetting::getSettings() called
        ↓
[Cache MISS] → Query DB → Cache for 10 min
        ↓
Inertia middleware shares data to frontend
        ↓
React receives theme via usePage().props
        ↓
ThemeProvider makes theme available
        ↓
AppLayout injects CSS variables to DOM
        ↓
TailwindCSS classes reference CSS variables
        ↓
Browser renders with new theme
        ↓
✅ User sees updated colors/font!
```

---

## 🗂️ File Structure

```
project-root/
│
├── app/
│   ├── Models/
│   │   └── ShopSetting.php              # Theme logic + FONT_MAP
│   │
│   ├── Filament/Resources/
│   │   └── ShopSettingResource.php      # Admin UI for theme
│   │
│   └── Http/Middleware/
│       └── HandleInertiaRequests.php    # Share theme to frontend
│
├── database/
│   └── migrations/
│       └── XXXX_add_theme_colors_to_shop_settings.php
│
├── resources/
│   ├── views/
│   │   └── app.blade.php                # Load Google Fonts
│   │
│   └── js/
│       ├── Contexts/
│       │   └── ThemeContext.tsx         # Theme state management
│       │
│       ├── Layouts/
│       │   └── AppLayout.tsx            # Inject CSS variables
│       │
│       ├── Components/
│       │   ├── Header.tsx               # Themed component
│       │   ├── Footer.tsx               # Themed component
│       │   ├── Button.tsx               # Themed component
│       │   └── Card.tsx                 # Themed component
│       │
│       └── Pages/
│           ├── Home.tsx                 # Themed page
│           ├── Products/
│           │   ├── Index.tsx
│           │   └── Show.tsx
│           └── Articles/
│               ├── Index.tsx
│               └── Show.tsx
│
├── tailwind.config.js                   # CSS variable mappings
│
└── agent/
    ├── REBRANDING_IMPLEMENTATION_PLAN.md
    ├── REBRANDING_SUMMARY.md
    ├── FONT_OPTIONS_REFERENCE.md
    ├── QUICK_START_GUIDE.md
    ├── IMPLEMENTATION_CHECKLIST.md
    └── ARCHITECTURE_OVERVIEW.md         # This file
```

---

## 🎨 Theme Color Mapping

### Database → CSS Variables → TailwindCSS

| DB Column | CSS Variable | Tailwind Class | Usage |
|-----------|--------------|----------------|-------|
| `theme_primary_color` | `--color-primary` | `bg-primary` | Buttons, links, highlights |
| `theme_secondary_color` | `--color-secondary` | `bg-secondary` | Supporting elements |
| `theme_accent_color` | `--color-accent` | `bg-accent` | Emphasis, CTAs |
| `theme_background_color` | `--color-bg` | `bg-bg-main` | Page backgrounds (light) |
| `theme_background_dark_color` | `--color-bg-dark` | `dark:bg-bg-dark` | Page backgrounds (dark) |
| `theme_text_color` | `--color-text` | `text-main` | Primary text |
| `theme_text_light_color` | `--color-text-light` | `text-light` | Secondary text |
| `theme_success_color` | `--color-success` | `bg-success` | Success states |
| `theme_error_color` | `--color-error` | `bg-error` | Error states |
| `theme_warning_color` | `--color-warning` | `bg-warning` | Warning states |
| `theme_info_color` | `--color-info` | `bg-info` | Info states |
| `theme_border_radius` | `--border-radius` | `rounded-theme` | All border radius |
| `theme_font_family` | `--font-family` | `font-theme` | All text |

---

## 🔌 Integration Points

### 1. Admin Panel → Database
```php
// Filament form saves to DB
ShopSetting::find(1)->update([
    'theme_primary_color' => '#FF6B6B',
    'theme_font_family' => 'poppins',
]);

// Cache automatically cleared on save()
```

### 2. Database → Laravel Model
```php
// Retrieve with caching
$settings = ShopSetting::getSettings(); // Cached 10 min

// Get theme data
$colors = $settings->getThemeColors();
$fontUrl = $settings->getFontUrl();
$fontFamily = $settings->getFontFamily();
```

### 3. Laravel → Inertia → React
```php
// Middleware shares data
public function share(Request $request): array
{
    return [
        'theme' => ShopSetting::getSettings()->getThemeColors(),
    ];
}
```

```tsx
// React receives data
const { theme } = usePage().props;
```

### 4. React → DOM
```tsx
// Inject CSS variables
useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--font-family', theme.fontFamily);
    // ... more
}, [theme]);
```

### 5. TailwindCSS → Styled Components
```tsx
// Use themed classes
<button className="bg-primary text-white rounded-theme font-theme">
    Click Me
</button>
```

---

## ⚡ Performance Optimizations

### 1. Database Caching
- **Cache Duration:** 10 minutes
- **Cache Key:** `shop_settings`
- **Invalidation:** Automatic on save()
- **Benefit:** Reduces DB queries from every request to once per 10 min

### 2. Google Fonts CDN
- **Preconnect:** DNS resolution happens early
- **Display Swap:** No FOIT (Flash of Invisible Text)
- **Caching:** Browsers cache fonts globally
- **Benefit:** Fast font loading, shared cache across websites

### 3. CSS Variables
- **No Rebuild:** Changes don't require recompiling CSS
- **Native Browser Support:** Fast, no polyfills needed
- **Dynamic:** Can change at runtime
- **Benefit:** Instant theme updates without deployment

### 4. Inertia Shared Data
- **Shared Once:** Theme data shared once per page load
- **Automatic:** No manual API calls needed
- **Cached:** Inertia caches page data
- **Benefit:** Efficient data transfer

---

## 🔒 Security Considerations

### 1. Color Validation
- **Hex Format:** Validated in Filament (ColorPicker component)
- **Pattern:** `/^#[0-9A-Fa-f]{6}$/`
- **Sanitization:** Laravel automatically escapes output

### 2. Font Selection
- **Whitelist:** Only predefined fonts allowed (no SQL injection)
- **No User Upload:** Fonts loaded from Google CDN only
- **Slug-based:** Font stored as slug, not full CSS

### 3. Admin Access
- **Authentication:** Only admins can access Filament
- **Authorization:** Filament's built-in authorization
- **Audit Trail:** Laravel logs all changes

### 4. XSS Prevention
- **React Escaping:** React automatically escapes output
- **Blade Escaping:** Blade `{{ }}` syntax escapes
- **CSS Variables:** Safe to inject (no JS execution)

---

## 🧪 Testing Strategy

### Unit Tests
```php
// ShopSetting model tests
test('it returns theme colors array')
test('it returns correct font URL')
test('it returns correct font family string')
test('it handles missing font gracefully')
test('cache is invalidated on save')
```

### Integration Tests
```php
// Admin panel tests
test('admin can update theme colors')
test('theme changes persist to database')
test('cache is cleared after theme update')
```

### E2E Tests
```javascript
// Frontend tests
test('theme colors apply to buttons')
test('font loads and displays')
test('dark mode toggle works')
test('theme persists across pages')
```

---

## 🚀 Deployment Flow

```
Local Development
        ↓
Commit & Push to Git
        ↓
Review (Optional)
        ↓
Merge to Main
        ↓
Deploy to Staging
        ↓
Run Migrations
        ↓
Build Frontend Assets
        ↓
Test in Staging
        ↓
Deploy to Production
        ↓
Monitor & Verify
```

---

## 📊 Monitoring & Analytics

### Metrics to Track
- **Page Load Time:** Should remain < 3s
- **Font Load Time:** Should be < 500ms
- **Admin Theme Changes:** Track frequency
- **Popular Font Choices:** Analytics on font usage
- **Error Rate:** Monitor for theme-related errors

### Tools
- **Laravel Telescope:** Debug database queries
- **Browser DevTools:** Check CSS variables
- **Lighthouse:** Performance audits
- **Google Analytics:** User behavior

---

## 🔮 Future Enhancements

### Phase 2 Features
1. **Theme Presets:** Pre-made color schemes
2. **Live Preview:** Real-time preview in admin
3. **Export/Import:** Backup and restore themes
4. **A/B Testing:** Test different themes
5. **Theme Scheduling:** Auto-switch themes (e.g., dark mode at night)
6. **Per-User Themes:** Users choose their own theme
7. **Theme Marketplace:** Community-created themes

---

**Document Version:** 1.0  
**Last Updated:** 2026-09-20  
**Purpose:** Technical reference for developers
