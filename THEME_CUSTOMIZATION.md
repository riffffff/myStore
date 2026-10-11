# 🎨 Dynamic Theme Customization System — PaiTech

Dokumentasi teknis dan panduan operasional untuk **Dynamic Theme Customization System** di platform e-commerce PaiTech.

---

## 📋 Ikhtisar Arsitektur

Theme system PaiTech dirancang dengan pendekatan **End-to-End Dynamic Customization**:
Admin mengatur warna dan tipografi di Filament Admin Panel → Data disimpan di tabel `shop_settings` → Dishare secara otomatis melalui `HandleInertiaRequests` middleware → Diinjeksikan ke DOM sebagai CSS Variables oleh `ThemeContext.tsx` → Diterapkan ke komponen React melalui TailwindCSS 4 `@theme` mappings dan CSS Custom Properties.

```
┌─────────────────────────────────┐
│     Filament Admin Panel        │
│   (ShopSettingResource: Tabs)   │
└────────────────┬────────────────┘
                 │ Simpan
                 ▼
┌─────────────────────────────────┐
│     Database: shop_settings     │
│   (14 Theme Columns + Caching)  │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│   HandleInertiaRequests (PHP)   │
│   - getThemeColors()            │
│   - dynamic Google Font URL     │
└────────────────┬────────────────┘
                 │ Inertia page.props
                 ▼
┌─────────────────────────────────┐
│       ThemeContext.tsx          │
│   - Injeksi CSS vars ke :root   │
│   - Manage Dark Mode state      │
└────────────────┬────────────────┘
                 │ CSS Custom Properties
                 ▼
┌─────────────────────────────────┐
│   Frontend Components (React)   │
│   (Tailwind v4: font-theme,     │
│    rounded-theme, theme colors) │
└─────────────────────────────────┘
```

---

## 🗄️ 1. Database Schema

Tabel `shop_settings` memiliki 14 kolom tema:

| Kolom | Tipe | Default | Keterangan |
|---|---|---|---|
| `theme_primary_color` | string | `#3B82F6` | Warna utama (button, brand accent) |
| `theme_secondary_color` | string | `#8B5CF6` | Warna sekunder |
| `theme_accent_color` | string | `#F59E0B` | Warna aksen / highlight |
| `theme_background_color` | string | `#FFFFFF` | Background mode terang |
| `theme_background_dark_color` | string | `#111827` | Background mode gelap |
| `theme_text_color` | string | `#1F2937` | Warna teks utama |
| `theme_text_light_color` | string | `#6B7280` | Warna teks pendukung / muted |
| `theme_success_color` | string | `#10B981` | Notifikasi / status sukses |
| `theme_error_color` | string | `#EF4444` | Pesan / status error |
| `theme_warning_color` | string | `#F59E0B` | Status peringatan |
| `theme_info_color` | string | `#3B82F6` | Status info |
| `theme_border_radius` | string | `0.5rem` | Radius sudut elemen UI |
| `theme_font_family` | string | `inter` | Slug font Google |
| `theme_dark_mode_enabled` | boolean | `true` | Toggle ketersediaan dark mode |

---

## 🔤 2. Pilihan Font Google (13 Fonts)

Daftar font yang didukung lengkap dengan URL Google Fonts dan CSS family fallback:

| Slug | Nama Font | Gaya |
|---|---|---|
| `inter` | Inter | Modern, Clean, Sans-serif |
| `roboto` | Roboto | Google Default, Sans-serif |
| `poppins` | Poppins | Rounded, Friendly |
| `montserrat` | Montserrat | Geometric, Bold |
| `open-sans` | Open Sans | Neutral, Highly Legible |
| `lato` | Lato | Corporate, Balanced |
| `raleway` | Raleway | Elegant, Sophisticated |
| `nunito` | Nunito | Soft, Rounded, Playful |
| `source-sans` | Source Sans 3 | Technical, Clear |
| `work-sans` | Work Sans | Structural, Modern |
| `playfair` | Playfair Display | Serif, Luxury, Editorial |
| `merriweather` | Merriweather | Serif, High Readability |
| `system` | System Default | Native OS Font |

---

## 🎨 3. CSS Variables Mapping

Di file [resources/css/app.css](file:///home/rifai/project/Store/resources/css/app.css), TailwindCSS v4 membaca CSS variables yang diinjeksi oleh `ThemeContext`:

```css
@theme {
    --color-theme-primary:        var(--color-primary, #3B82F6);
    --color-theme-secondary:      var(--color-secondary, #8B5CF6);
    --color-theme-accent:         var(--color-accent, #F59E0B);
    --color-theme-bg:             var(--color-bg, #FFFFFF);
    --color-theme-bg-dark:        var(--color-bg-dark, #111827);
    --color-theme-text:           var(--color-text, #1F2937);
    --color-theme-text-light:     var(--color-text-light, #6B7280);
    --color-theme-success:        var(--color-success, #10B981);
    --color-theme-error:          var(--color-error, #EF4444);
    --color-theme-warning:        var(--color-warning, #F59E0B);
    --color-theme-info:           var(--color-info, #3B82F6);

    --radius-theme:               var(--border-radius, 0.5rem);
    --font-theme:                 var(--font-family, 'Inter', system-ui, sans-serif);
}
```

---

## 💻 4. Penggunaan di Komponen React

### Menggunakan `useTheme` Hook
```tsx
import { useTheme } from '@/Contexts/ThemeContext';

export default function MyComponent() {
    const { colors, isDarkMode, toggleDarkMode } = useTheme();

    return (
        <div>
            <p style={{ color: colors.primary }}>Warna utama dinamis: {colors.primary}</p>
            {colors.darkModeEnabled && (
                <button onClick={toggleDarkMode}>
                    {isDarkMode ? '🌞 Light' : '🌙 Dark'}
                </button>
            )}
        </div>
    );
}
```

### Menggunakan Tailwind Classes
```tsx
<div className="bg-theme-bg dark:bg-theme-bg-dark text-theme-text font-theme rounded-theme p-4">
    <button className="bg-theme-primary text-white px-4 py-2 rounded-theme hover:opacity-90">
        Klik Disini
    </button>
</div>
```

---

## 🛡️ 5. Cache & Performance

- **Caching**: `ShopSetting::getSettings()` menyimpan konfigurasi dalam cache selama 24 jam (`now()->addDay()`).
- **Auto-Flush**: Setiap kali data disimpan di Filament admin, cache otomatis dihapus via `flushCache()`.
- **Preconnect**: Tag `<link rel="preconnect">` disertakan di [app.blade.php](file:///home/rifai/project/Store/resources/views/app.blade.php) untuk mempercepat DNS lookup Google Fonts.
