# Analisis Penyebab Error: Gagal Upload & Gagal Registrasi User

> **Revisi 2** (2026-11-04). Versi sebelumnya mengandung beberapa klaim keliru yang sudah dikoreksi.
> Lihat bagian [Koreksi dari Versi Sebelumnya](#koreksi-dari-versi-sebelumnya) di bawah.

## Konteks Production

| Item | Nilai |
|---|---|
| Deploy | `docker-compose` di VPS ([Dockerfile](file:///home/rifai/project/Store/Dockerfile), [docker-compose.yml](file:///home/rifai/project/Store/docker-compose.yml)) |
| Server | 2 vCPU, RAM 2 GB (terpakai ~818 MiB, swap terpakai ~369 MiB), disk 40 GB |
| Database | SQLite (`database/database.sqlite`, di-mount sebagai volume) |
| Gejala | Error bervariasi: kadang 500, kadang 4xx, terjadi intermiten |
| Log production | Tidak tersedia, sehingga analisis ini berbasis pembacaan kode dan konfigurasi |

---

## Ringkasan Akar Masalah (urut dari dampak terbesar)

| # | Akar Masalah | Fitur Terdampak | Gejala yang Muncul |
|---|---|---|---|
| A | Server `php artisan serve` hanya berjalan **1 proses** | Semua fitur | Request antri, timeout, error acak |
| B | Limit upload PHP default (2M / 8M) tidak sesuai validasi (5 MB) | Semua upload | 422 "failed to upload", 413 Post Too Large |
| C | Nomor HP tidak dinormalisasi sebelum dicek unique | Registrasi, login | 500 `UNIQUE constraint failed: users.email`, akun tidak bisa login |
| D | Session disimpan di filesystem container (tidak persisten) | Registrasi, login, semua form | 419 Page Expired setelah container restart/redeploy |
| E | GD memproses foto resolusi tinggi dengan `memory_limit` 128M | Upload admin | 500 Allowed memory size exhausted |
| F | Symlink `public/storage` ter-commit di git dengan path absolut lokal | Upload (di luar Docker) | File gagal tersimpan atau 404 |

---

## A. Server Production Hanya Melayani 1 Request dalam Satu Waktu

**File:** [docker-entrypoint.sh](file:///home/rifai/project/Store/docker-entrypoint.sh#L40), [Dockerfile](file:///home/rifai/project/Store/Dockerfile#L52), [ServeCommand.php](file:///home/rifai/project/Store/vendor/laravel/framework/src/Illuminate/Foundation/Console/ServeCommand.php#L100-L114)

```bash
exec php artisan serve --host=0.0.0.0 --port=8002
```

1. `php artisan serve` adalah **development server** (PHP built-in server), bukan server production.
2. `PHP_CLI_SERVER_WORKERS=4` sudah di-set, tetapi [ServeCommand.php baris 105-111](file:///home/rifai/project/Store/vendor/laravel/framework/src/Illuminate/Foundation/Console/ServeCommand.php#L105-L111) **mengabaikannya** jika flag `--no-reload` tidak dipakai:
   ```php
   if ($workers > 1 && ! $this->option('no-reload') && ! (int) env('LARAVEL_SAIL', 0)) {
       $this->components->warn('Unable to respect the `PHP_CLI_SERVER_WORKERS` ... Only creating a single server.');
       return false;
   }
   ```
3. Akibatnya hanya ada **1 proses PHP** yang melayani seluruh pengunjung secara berurutan.
4. Satu upload foto dari HP dengan sinyal lambat (bisa belasan detik), atau proses konversi gambar dengan GD, akan **memblokir semua request lain** (halaman produk, registrasi, login). Request yang mengantri terlalu lama berakhir timeout atau error di sisi browser.
5. Inilah penjelasan paling kuat untuk gejala **"error macam-macam dan acak"**: hasilnya bergantung pada apakah ada request lain yang sedang diproses saat klien menekan tombol.

### A.1. Efek samping: variabel `environment:` di docker-compose diabaikan

**File:** [ServeCommand.php baris 183-189](file:///home/rifai/project/Store/vendor/laravel/framework/src/Illuminate/Foundation/Console/ServeCommand.php#L183-L189), [.dockerignore](file:///home/rifai/project/Store/.dockerignore)

1. Tanpa `--no-reload`, `artisan serve` **membuang semua environment variable** kecuali daftar `$passthroughVariables` (`APP_ENV`, `PATH`, dll.) sebelum menjalankan proses server.
2. Akibatnya `APP_URL`, `DB_CONNECTION`, dan `DB_DATABASE` dari `docker-compose.yml` dan `env_file` **tidak sampai ke aplikasi**.
3. Aplikasi justru membaca file `/var/www/html/.env` di dalam container. File ini berasal dari:
   - `.env` di mesin build, yang **ikut ter-copy ke image** karena `.env` tidak tercantum di [.dockerignore](file:///home/rifai/project/Store/.dockerignore). File `.env` lokal saat ini berisi `APP_ENV=local`, `APP_DEBUG=true`, `APP_URL=http://localhost:8000`.
   - atau `.env.example` (jika `.env` tidak ada), yang di-copy oleh [docker-entrypoint.sh](file:///home/rifai/project/Store/docker-entrypoint.sh#L20-L22) dengan `SESSION_DRIVER=database` dan `CACHE_STORE=database`.
4. Konfigurasi yang benar-benar aktif di production jadi **tidak bisa dipastikan** dan bisa berubah setiap kali image di-build ulang.

---

## B. Limit Upload PHP Tidak Sesuai dengan Validasi Aplikasi

**File:** [Dockerfile](file:///home/rifai/project/Store/Dockerfile), [StoreOrderRequest.php](file:///home/rifai/project/Store/app/Http/Requests/StoreOrderRequest.php#L21-L27), [AdminController.php](file:///home/rifai/project/Store/app/Http/Controllers/Admin/AdminController.php#L354-L355)

1. Image `php:8.3-cli-alpine` **tidak menyertakan `php.ini`**, sehingga berlaku nilai default:
   - `upload_max_filesize = 2M`
   - `post_max_size = 8M`
   - `memory_limit = 128M`
2. Validasi Laravel mengizinkan file sampai **5 MB** (`max:5120`) di semua titik upload:

   | Lokasi | Field |
   |---|---|
   | [StoreOrderRequest.php:21-27](file:///home/rifai/project/Store/app/Http/Requests/StoreOrderRequest.php#L21-L27) | `payment_proof` (bukti bayar QRIS) |
   | [AdminController.php:354-355](file:///home/rifai/project/Store/app/Http/Controllers/Admin/AdminController.php#L354-L355), [:422-423](file:///home/rifai/project/Store/app/Http/Controllers/Admin/AdminController.php#L422-L423) | `images.*` produk (maks 10 file) |
   | [AdminController.php:533](file:///home/rifai/project/Store/app/Http/Controllers/Admin/AdminController.php#L533), [:580](file:///home/rifai/project/Store/app/Http/Controllers/Admin/AdminController.php#L580) | `image` artikel |
   | [AdminController.php:699-700](file:///home/rifai/project/Store/app/Http/Controllers/Admin/AdminController.php#L699-L700) | `logo`, `qris_image` |

3. Foto kamera HP umumnya berukuran **2.5–8 MB**.
   - **File > 2 MB:** PHP menolak file (`UPLOAD_ERR_INI_SIZE`) sebelum sampai ke Laravel. Validasi gagal dengan pesan bawaan Laravel berbahasa Inggris ("failed to upload") atau "Bukti transfer QRIS wajib diunggah". Klien bingung karena merasa sudah memilih file.
   - **Total request > 8 MB** (misalnya admin upload beberapa foto produk sekaligus): middleware `ValidatePostSize` melempar `PostTooLargeException` (**413**).
   - **Screenshot (< 2 MB):** berhasil.
4. Kombinasi ini menjelaskan keluhan **"kadang berhasil, kadang gagal"** pada fitur upload.
5. Tidak ada pengecekan ukuran file di frontend pada kelima input file berikut: [Order/Create.tsx:487](file:///home/rifai/project/Store/resources/js/Pages/Order/Create.tsx#L487), [Products/Form.tsx:304](file:///home/rifai/project/Store/resources/js/Pages/MobileAdmin/Products/Form.tsx#L304), [Articles/Form.tsx:177](file:///home/rifai/project/Store/resources/js/Pages/MobileAdmin/Articles/Form.tsx#L177), [Settings.tsx:69](file:///home/rifai/project/Store/resources/js/Pages/MobileAdmin/Settings.tsx#L69), [Settings.tsx:90](file:///home/rifai/project/Store/resources/js/Pages/MobileAdmin/Settings.tsx#L90). Akibatnya file besar tetap dikirim penuh ke server (lama di jaringan HP, dan sekaligus memblokir server, lihat poin A) sebelum akhirnya ditolak.

---

## C. Nomor HP Tidak Dinormalisasi: Bentrok Unique Email dan Gagal Login

**File:** [RegisteredUserController.php](file:///home/rifai/project/Store/app/Http/Controllers/Auth/RegisteredUserController.php#L24-L54), [LoginRequest.php](file:///home/rifai/project/Store/app/Http/Requests/Auth/LoginRequest.php#L69-L81), [create_users_table.php](file:///home/rifai/project/Store/database/migrations/0001_01_01_000000_create_users_table.php#L17)

```php
'phone' => 'nullable|string|max:25|unique:'.User::class.',phone',   // dicek dalam bentuk MENTAH
...
$phone      = $validated['phone'];                                   // disimpan MENTAH
$cleanPhone = preg_replace('/[^0-9]/', '', $phone);                  // dibersihkan
$email      = $validated['email'] ?: $cleanPhone . '@customer.local'; // email dummy dari nomor BERSIH
```

### C.1. Crash 500 saat registrasi
1. User A daftar dengan `081234567890` tanpa email. Tersimpan `phone=081234567890`, `email=081234567890@customer.local`.
2. User B (atau A yang mencoba lagi) daftar dengan `0812-3456-7890` atau `0812 3456 7890` tanpa email.
3. `unique:users,phone` **lolos**, karena string `0812-3456-7890` ≠ `081234567890`.
4. Email dummy yang dihasilkan sama persis: `081234567890@customer.local`.
5. `User::create()` gagal dengan `SQLSTATE[23000]: UNIQUE constraint failed: users.email`, dan klien menerima **error 500** tanpa pesan yang bisa dipahami.

### C.2. Nomor sama tetapi format berbeda dianggap user berbeda
- `+6281234567890` dan `081234567890` menghasilkan nomor bersih yang berbeda (`6281…` vs `081…`), sehingga lolos semua validasi dan menjadi **dua akun terpisah** untuk orang yang sama.

### C.3. Gagal login setelah registrasi berhasil
- Nomor disimpan mentah, misalnya `0812 3456 7890`. [LoginRequest.php:72-74](file:///home/rifai/project/Store/app/Http/Requests/Auth/LoginRequest.php#L72-L74) mencari `phone = input` **atau** `phone = angka_saja(input)`.
- Jika klien login dengan format yang berbeda dari saat daftar (misalnya daftar `0812 3456 7890`, login `081234567890` atau `+62812…`), user tidak ditemukan dan muncul pesan "kredensial salah". Dari sisi klien ini terlihat seperti "registrasi gagal".

### C.4. Titik lain yang menyimpan nomor HP tanpa normalisasi
- [UpdateProfileRequest.php:29](file:///home/rifai/project/Store/app/Http/Requests/Profile/UpdateProfileRequest.php#L29) (`phone` di profil)
- [StoreOrderRequest.php:19](file:///home/rifai/project/Store/app/Http/Requests/StoreOrderRequest.php#L19) (`customer_phone`)
- [AdminController.php:696-708](file:///home/rifai/project/Store/app/Http/Controllers/Admin/AdminController.php#L696-L708) (`shop_phone`, dipakai untuk link WhatsApp)

---

## D. Session Tidak Persisten: 419 Page Expired

**File:** [docker-compose.yml](file:///home/rifai/project/Store/docker-compose.yml#L18-L20), [AuthModal.tsx](file:///home/rifai/project/Store/resources/js/Components/Public/AuthModal.tsx#L42-L50)

1. Volume yang di-mount hanya `./storage/app` dan `./database`.
2. Jika `SESSION_DRIVER=file`, file session ada di `storage/framework/sessions` **di dalam container** dan hilang setiap kali container di-recreate (redeploy / `docker compose up --build`).
3. Klien yang sedang membuka halaman (misalnya form registrasi di modal) lalu submit setelah redeploy akan mendapat **419 Page Expired** karena token CSRF-nya sudah tidak dikenali.
4. Saat ini frontend tidak menangani status 419. Inertia hanya menampilkan halaman error mentah, tanpa reload otomatis atau pesan yang ramah.
5. Masa aktif session (`SESSION_LIFETIME=120` menit) juga memicu 419 untuk tab yang dibiarkan terbuka lama.

---

## E. Pemrosesan Gambar di GD Bisa Kehabisan Memori

**File:** [ImageService.php](file:///home/rifai/project/Store/app/Services/ImageService.php#L130-L332), [image_processor.py](file:///home/rifai/project/Store/app/Services/image_processor.py)

1. `ImageService` mencoba konversi ke WebP via Python + Pillow terlebih dahulu. Container **tidak memiliki Python**, jadi langkah ini langsung gagal (cepat, tanpa hang), lalu fallback ke GD.
2. GD mendekompresi gambar ke memori mentah dengan kebutuhan ≈ `lebar × tinggi × 4 byte` (ditambah overhead). Foto 12 MP (4000×3000) bisa memakan **~50–100 MB**, dan proses resize (`imagecreatetruecolor` kedua) menambah lagi.
3. Dengan `memory_limit = 128M` (default image), gambar resolusi tinggi dapat memicu **Fatal error: Allowed memory size exhausted (500)**.
4. Karena server hanya 1 proses (poin A), konversi yang lama juga ikut memblokir pengunjung lain.

---

## F. Symlink `public/storage` Ter-commit di Git

**File:** [public/storage](file:///home/rifai/project/Store/public/storage), [.gitignore](file:///home/rifai/project/Store/.gitignore), [config/filesystems.php](file:///home/rifai/project/Store/config/filesystems.php#L41-L48)

1. `git ls-files public/storage` menunjukkan symlink ini ter-track, dengan target absolut `/home/rifai/project/Store/storage/app/public`.
2. Disk `public` menulis ke `public_path('storage')` (yaitu lewat symlink tersebut) dengan `'throw' => false`.
3. **Di Docker** saat ini masalah ini **tertutupi**, karena [docker-entrypoint.sh:30](file:///home/rifai/project/Store/docker-entrypoint.sh#L30) menjalankan `storage:link --force` yang membuat ulang symlink dengan path yang benar.
4. Masalah ini tetap menjadi **bom waktu** jika project di-deploy tanpa entrypoint tersebut (git pull ke hosting/VPS biasa). Upload akan gagal diam-diam (`store()` mengembalikan `false`, path tersimpan `null`).

---

## Faktor Pendukung (bukan penyebab utama)

| Faktor | Penjelasan |
|---|---|
| SQLite tanpa WAL | [config/database.php:41-43](file:///home/rifai/project/Store/config/database.php#L41-L43): `journal_mode` dan `busy_timeout` = `null`. Dengan mode journal default, penulis memblokir pembaca. Selama server masih 1 proses (poin A) dampaknya kecil, tetapi akan **muncul** begitu server dibuat multi-thread, terutama jika session/cache memakai driver `database`. |
| Validasi MIME | `mimes:jpeg,png,jpg,webp` menolak PDF bukti transfer dari m-Banking. Untuk HEIC dari iPhone dampaknya kecil, karena Safari umumnya otomatis mengonversi ke JPEG untuk `<input accept="image/*">`. |

---

## Koreksi dari Versi Sebelumnya

| Klaim di Versi 1 | Status | Alasan |
|---|---|---|
| 2.3 Mailer SMTP timeout saat event `Registered` | ❌ **Dihapus** | Model [User](file:///home/rifai/project/Store/app/Models/User.php) tidak mengimplementasikan `MustVerifyEmail`, jadi event `Registered` tidak mengirim email apa pun. |
| 2.5 `TrustHosts` memblokir registrasi | ❌ **Dihapus** | Jika host tidak cocok, **seluruh situs** mendapat 400, bukan hanya registrasi. Karena situs bisa diakses, ini bukan penyebabnya. |
| 2.1 SQLite "tidak mau menunggu" (`busy_timeout=null` → 0 ms) | ⚠️ **Dikoreksi** | PDO SQLite memiliki timeout default ±60 detik. Lock tetap mungkin terjadi, tetapi bukan penyebab utama saat server masih 1 proses. Dipindah ke Faktor Pendukung. |
| 1.2 Symlink rusak menyebabkan upload gagal di production | ⚠️ **Dikoreksi** | Di Docker tertutupi oleh `storage:link --force` di entrypoint. Tetap dicatat sebagai risiko (poin F). |
| 1.3 Python/Pillow menyebabkan hang | ⚠️ **Dikoreksi** | Tanpa Python, `which` langsung gagal sehingga tidak ada hang. Risiko sebenarnya adalah memori GD (poin E). |
| 1.4 HEIC sebagai penyebab | ⚠️ **Diturunkan** | Safari iOS mengonversi otomatis. Dipindah ke Faktor Pendukung. |
| *(tidak ada)* | 🆕 **Ditambahkan** | Poin A (server 1 proses + env diabaikan) dan poin D (session tidak persisten). |
