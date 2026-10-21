# PaiTech — Modern E-Commerce Platform

PaiTech adalah platform e-commerce modern dengan arsitektur **Laravel 12 + Filament 3 + React 19 + Inertia.js 2 + TailwindCSS 4**, dilengkapi dengan **Dynamic Theme Customization System** dan arsitektur backend berbasis Service Pattern & Form Requests.

---

## 🚀 Fitur Unggulan

### 1. 🎨 Dynamic Theme Customization System
Admin dapat menyesuaikan tema tampilan website secara langsung melalui Filament Admin Panel tanpa perlu rebuild aplikasi:
- **11 Palette Warna**:
  - Primary, Secondary, Accent
  - Background (Light & Dark)
  - Text & Text Light
  - Status: Success, Error, Warning, Info
- **13 Google Fonts Terpilih**: Inter, Roboto, Poppins, Montserrat, Open Sans, Lato, Raleway, Nunito, Source Sans 3, Work Sans, Playfair Display, Merriweather, dan System Default.
- **Border Radius**: Sharp (0), Small (4px), Medium (8px), Large (12px), XL (16px), Rounded (24px).
- **Dark Mode Support**: Admin dapat mengaktifkan/menonaktifkan dukungan mode gelap.
- **Real-Time CSS Injection**: Disinkronkan melalui CSS Custom Properties (`:root`) via React Context (`ThemeContext.tsx`).

### 2. ⚡ Modern Frontend Stack
- **React 19 + TypeScript 5.7**: Tipikal tipe yang ketat dengan `@/types/index.d.ts`.
- **Inertia.js v2**: Seamless SPA navigation dengan dynamic page props sharing.
- **TailwindCSS v4**: Dynamic CSS variables mapping dengan class utilities (`bg-theme-primary`, `font-theme`, `rounded-theme`, dll).
- **Lucide React Icons**: Iconography modern dan konsisten.

### 3. 🛡️ Clean Architecture Backend
- **Service Layer Pattern**: Logika bisnis diisolasi di `app/Services/` (`ArticleService`, `ProductService`, `ReviewService`, `ShopSettingService`).
- **Form Request Validation**: Validasi terisolasi di `app/Http/Requests/`.
- **Filament Admin 3**: Panel admin responsif dengan Tabs organisasi (Identitas, Branding, Kontak, Theme Colors).
- **Cache Optimization**: Pengaturan toko dicache dengan `ShopSetting::getSettings()` dan auto-flushed saat disimpan.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Backend Framework** | Laravel 12.x / PHP 8.2+ |
| **Admin Panel** | Filament 3.x |
| **Frontend Framework** | React 19, Inertia.js 2.x |
| **Styling** | TailwindCSS 4.x |
| **Language** | PHP, TypeScript, Blade |
| **Database** | SQLite (dev) / MySQL / PostgreSQL |

---

## 📦 Instalasi & Setup Lokal

### 1. Clone & Dependencies
```bash
# Clone repository
git clone <repository-url>
cd Store

# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### 2. Konfigurasi Lingkungan
```bash
# Salin file konfigurasi .env
cp .env.example .env

# Generate application key
php artisan key:generate
```

Pastikan variabel `APP_NAME` di file `.env`:
```env
APP_NAME=PaiTech
```

### 3. Migrasi & Seeder Database
```bash
# Jalankan migrasi dan seeder awal
php artisan migrate --seed
```

Default kredensial admin:
- **URL**: `http://localhost:8000/admin`
- **Email**: `admin@paitech.id`
- **Password**: `password123`

### 4. Menjalankan Aplikasi
Buka dua terminal terpisah:

**Terminal 1 (Backend Server):**
```bash
php artisan serve
```

**Terminal 2 (Vite Dev Server):**
```bash
npm run dev
```

---

## 🎨 Panduan Kustomisasi Tema

1. Buka panel admin di `/admin`.
2. Masuk ke menu **Shop Settings**.
3. Pilih tab **Theme Colors**.
4. Atur palet warna sesuai kebutuhan brand menggunakan color picker interaktif.
5. Pilih jenis font dan border radius.
6. Klik **Save** (Simpan).
7. Tampilan frontend toko akan langsung berubah sesuai pengaturan baru tanpa perlu restart server!

---

## 🧪 Testing & Build

```bash
# Verifikasi Type & Build Frontend (Client + SSR)
npm run build

# Clear Cache Aplikasi
php artisan optimize:clear
```

---

## 📄 Lisensi
Platform ini dilisensikan di bawah lisensi [MIT](LICENSE).
