<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/**
 * ARTISAN COMMAND KHUSUS SHARED HOSTING TANPA SYMLINK SUPPORT.
 * Alih-alih pakai `php artisan storage:link` (yang membutuhkan symlink),
 * command ini akan MENSELKAN COPY SELURUH ISI storage/app/public/ ke public/storage/.
 *
 * Jalankan setiap kali kamu menambah file baru di storage/app/public
 * (mis: upload produk, upload logo toko baru).
 *
 * Usage:
 *   php artisan storage:copy           # copy semua (re-write jika ada perbedaan)
 *   php artisan storage:copy --force  # hapus public/storage/ dulu baru copy (clean)
 */
Artisan::command('storage:copy {--force : Hapus folder tujuan dulu (full sync)}', function () {
    $source = rtrim(storage_path('app/public'), '\\/');
    $dest   = rtrim(public_path('storage'), '\\/');

    if (! is_dir($source)) {
        $this->fail("Source tidak ditemukan: $source");
        return 1;
    }

    if ($this->option('force') && is_dir($dest)) {
        // Recursive delete dest via native
        $cleanup = function ($dir) use (&$cleanup) {
            if (! is_dir($dir)) return;
            $items = scandir($dir);
            if ($items === false) return;
            foreach ($items as $item) {
                if ($item === '.' || $item === '..') continue;
                $path = $dir . DIRECTORY_SEPARATOR . $item;
                if (is_dir($path) && ! is_link($path)) {
                    $cleanup($path);
                } else {
                    @unlink($path);
                }
            }
            @rmdir($dir);
        };
        $cleanup($dest);
        $this->warn("Dihapus penuh: $dest");
    }

    if (! is_dir($dest)) {
        @mkdir($dest, 0755, true);
    }

    $copied = 0;
    $skipped = 0;
    $dirCount = 0;

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($source, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );

    foreach ($iterator as $item) {
        /** @var \SplFileInfo $item */
        $relative = substr($item->getPathname(), strlen($source) + 1);
        if ($relative === false || $relative === '') continue;

        $targetPath = $dest . DIRECTORY_SEPARATOR . $relative;

        if ($item->isDir()) {
            if (! is_dir($targetPath)) {
                mkdir($targetPath, 0755, true);
                $dirCount++;
                $this->line("Dir   + $relative/");
            }
        } elseif ($item->isFile()) {
            $targetDir = dirname($targetPath);
            if (! is_dir($targetDir)) {
                mkdir($targetDir, 0755, true);
            }

            $needCopy = true;
            if (! $this->option('force') && is_file($targetPath)) {
                $needCopy = @filesize($item->getPathname()) !== @filesize($targetPath)
                    || @filemtime($item->getPathname()) > @filemtime($targetPath);
            }

            if ($needCopy) {
                copy($item->getPathname(), $targetPath);
                @chmod($targetPath, 0644);
                $copied++;
                $this->info("Copy  + $relative");
            } else {
                $skipped++;
            }
        }
    }

    $this->newLine();
    $this->info("Selesai! ✅");
    $this->line("Folder dibuat : $dirCount");
    $this->line("File dicopy  : $copied");
    $this->line("File di-skip : $skipped (sudah sama)");
    $this->line("Sumber       : $source");
    $this->line("Tujuan       : $dest");
    return 0;
})->purpose('Copy storage/app/public/ ke public/storage/ — alternatif storage:link untuk shared hosting tanpa symlink');

/**
 * Generate file gambar placeholder (produk, artikel, logo) via PHP GD.
 * Berguna untuk shared hosting baru setelah clone GitHub, karena folder
 * storage/app/public masuk .gitignore sehingga file placeholder tidak terbawa.
 *
 * Jalankan sebelum storage:copy / deploy:shared-hosting.
 */
Artisan::command('generate:placeholder-images {--force : Overwrite jika file sudah ada}', function () {
    $force = (bool) $this->option('force');

    if (!extension_loaded('gd') && !extension_loaded('gd2')) {
        $this->fail('PHP Extension GD tidak aktif! Aktifkan di cPanel -> Select PHP Version -> centang gd.');
        return 1;
    }

    $base = rtrim(storage_path('app/public'), '\\/');

    // --- Helper: buat folder jika belum ada ---
    $ensureDir = function (string $dir) use ($base, &$ensureDir) {
        $full = $base . DIRECTORY_SEPARATOR . ltrim($dir, '\\/');
        if (!is_dir($full)) {
            @mkdir($full, 0755, true);
        }
    };

    // --- Helper: buat gambar persegi / persegi panjang berwarna solid + teks ---
    $makePlaceholders = [];
    $mk = function (
        string $relPath,
        int $w,
        int $h,
        string $bgHex,
        string $textColor,
        string $label,
        ?string $subLabel = null
    ) use ($base, $force, &$countGen, &$countSkip) {
        $full = $base . DIRECTORY_SEPARATOR . ltrim($relPath, '\\/');
        $dir = dirname($full);
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }

        if (is_file($full) && !$force) {
            $this->line("Skip  $relPath (sudah ada, pakai --force untuk overwrite)");
            return;
        }

        $ext = strtolower(pathinfo($full, PATHINFO_EXTENSION));

        $img = @imagecreatetruecolor($w, $h);
        if (!$img) {
            $this->warn("Gagal alokasi GD untuk $relPath");
            return;
        }

        // Parse hex bg
        $bg = sscanf($bgHex, '#%02x%02x%02x');
        $bgColor = imagecolorallocate($img, $bg[0], $bg[1], $bg[2]);
        imagefill($img, 0, 0, $bgColor);

        // Border tipis
        $border = imagecolorallocate($img, (int)($bg[0] * 0.75), (int)($bg[1] * 0.75), (int)($bg[2] * 0.75));
        imagerectangle($img, 0, 0, $w - 1, $h - 1, $border);

        // Teks utama
        $tc = sscanf($textColor, '#%02x%02x%02x');
        $textColorAlloc = imagecolorallocate($img, $tc[0], $tc[1], $tc[2]);

        $fontSize = min($w, $h) > 400 ? 5 : (min($w, $h) > 200 ? 4 : 3);
        $lines = array_values(array_filter([$label, $subLabel]));
        $lineHeight = imagefontheight($fontSize) + 6;
        $startY = (int) round(($h - (count($lines) * $lineHeight)) / 2);

        foreach ($lines as $i => $line) {
            $lineWidth = imagefontwidth($fontSize) * strlen($line);
            $x = (int) round(($w - $lineWidth) / 2);
            $y = $startY + ($i * $lineHeight);
            imagestring($img, $fontSize, $x, $y, $line, $textColorAlloc);
        }

        // Simpan berdasarkan extension
        $ok = false;
        switch ($ext) {
            case 'webp':
                if (function_exists('imagewebp')) {
                    $ok = @imagewebp($img, $full, 80);
                }
                if (!$ok && function_exists('imagepng')) {
                    // fallback ke png tapi rename extension nya (tetap .webp di path,
                    // browser akan tetap baca karena header mime ditentukan server,
                    // tapi fallback lain: ganti file ke .png via exception path)
                    $ok = @imagepng($img, $full, 7);
                }
                break;
            case 'png':
                $ok = @imagepng($img, $full, 6);
                break;
            case 'jpg':
            case 'jpeg':
                $ok = @imagejpeg($img, $full, 85);
                break;
            default:
                // unknown -> fallback png
                $ok = @imagepng($img, $full . '.png', 6);
                break;
        }

        imagedestroy($img);

        if ($ok) {
            @chmod($full, 0644);
            $this->info("Buat  $relPath  ({$w}x{$h})");
            $GLOBALS['__ph_gen_count'] = ($GLOBALS['__ph_gen_count'] ?? 0) + 1;
        } else {
            $this->warn("Gagal simpan $relPath (permission? ekstensi?)");
        }
    };

    // Pastikan subfolder ada
    $ensureDir('products');
    $ensureDir('articles');
    $ensureDir('logo');
    $ensureDir('branding');

    // --- PALET WARNA untuk placeholder produk ---
    $palette = [
        ['#784828', '#FFF8E7'], // coklat tua
        ['#A86A3A', '#FFFFFF'], // coklat kayu
        ['#5C3A1E', '#F4D9A6'], // coklat gelap
        ['#8B5A2B', '#FFF8E7'], // kayu sedang
        ['#4A2E18', '#E8C88A'], // coklat espresso
        ['#6B4226', '#FFE8B8'], // coklat susu
    ];

    $produkNama = [
        1 => ['KURSI TAMU JATI', 'MINIMALIS'],
        2 => ['MEJA MAKAN JATI', 'SET 6 KURSI'],
        3 => ['LEMARI PAKAIAN', 'UKIR KAYU'],
        4 => ['TEMPAT TIDUR', 'KING SIZE 180x200'],
        5 => ['RAK BUKU RETRO', 'SCANDINAVIAN'],
        6 => ['MEJA BELAJAR JATI', 'DRAWER 2 SUSUN'],
    ];

    for ($i = 1; $i <= 6; $i++) {
        $p = $palette[($i - 1) % count($palette)];
        $nama = $produkNama[$i] ?? ["PRODUK $i", 'FURNITURE JATI'];
        // Produk utama: 1200x900
        $mk("products/product_{$i}.webp", 1200, 900, $p[0], $p[1], $nama[0], $nama[1]);
        // Detail produk: 1200x900 (detail view)
        $mk("products/product_{$i}_detail.webp", 1200, 900, $p[0], $p[1], $nama[0], 'DETAIL PRODUK ' . $i);
    }

    // --- Placeholder ARTIKEL (1600x900) ---
    $artNama = [
        1 => ['TIPS MERAWAT', 'FURNITURE KAYU JATI'],
        2 => ['TREN INTERIOR', 'TAHUN 2026'],
        3 => ['KEUNGGULAN', 'KAYU JATI PILIHAN'],
        4 => ['PADU WARNA', 'FURNITURE & CAT'],
        5 => ['TATA RUANG', 'TAMU SEMOGA LEBIH LUAS'],
    ];

    for ($i = 1; $i <= 5; $i++) {
        $p = $palette[($i + 1) % count($palette)];
        $nama = $artNama[$i] ?? ["ARTIKEL $i", 'INFO FURNITURE'];
        $mk("articles/article_{$i}.webp", 1600, 900, $p[0], $p[1], $nama[0], $nama[1]);
    }

    // --- Placeholder LOGO (light mode & dark mode) + FAVICON ---
    // Light mode: latar coklat gelap, teks putih (untuk header gelap)
    $mk('logo/logo.jpeg', 480, 140, '#784828', '#FFF8E7', 'Agus Gerobak', 'Gerobak & Meubel');
    // Dark mode: latar krem muda, teks coklat tua (untuk header putih/terang)
    $mk('logo/logo-dark.jpeg', 480, 140, '#FFF8E7', '#784828', 'Agus Gerobak', 'Gerobak & Meubel');
    // Favicon
    $mk('logo/favicon.png', 64, 64, '#784828', '#FFF8E7', 'AM', null);

    $countGen = (int) ($GLOBALS['__ph_gen_count'] ?? 0);

    $this->newLine();
    $this->info("Selesai generate placeholder.");
    $this->line("File dibuat : $countGen");
    $this->line("Simpan di   : $base");
    $this->newLine();
    $this->comment('Selanjutnya jalankan: php artisan storage:copy');
    return 0;
})->purpose('Generate gambar placeholder (produk, artikel, logo) via PHP GD — untuk hosting baru setelah clone GitHub');

/**
 * Shortcut untuk deploy cepat: clear cache + generate placeholder + copy storage + flush shop setting cache.
 */
Artisan::command('deploy:shared-hosting', function () {
    $this->info('Menjalankan optimasi + placeholder + storage:copy + flush cache untuk shared hosting...');
    $this->call('optimize:clear');
    $this->call('generate:placeholder-images');
    $this->call('storage:copy');
    $this->call('shop-settings:flush-cache');
    $this->info('Siap dijalankan! 🚀');
})->purpose('Optimize + generate placeholder + storage:copy + flush cache — deploy cepat untuk shared hosting tanpa Node & tanpa symlink');

/**
 * Flush cache setting toko (shop_settings) agar perubahan logo/data admin langsung terlihat di frontend.
 */
Artisan::command('shop-settings:flush-cache', function () {
    if (! class_exists(\App\Models\ShopSetting::class)) {
        $this->warn('Class ShopSetting tidak tersedia.');
        return 1;
    }
    \App\Models\ShopSetting::flushCache();
    $this->info('Cache shop_settings berhasil dihapus. Frontend akan ambil data terbaru dari DB pada request berikutnya.');
    $this->comment('Jangan lupa Hard Refresh browser (Ctrl+Shift+R / Cmd+Shift+R) untuk membersihkan cache sisi client (Inertia/React).');
    return 0;
})->purpose('Hapus cache Pengaturan Toko (shop_settings) — agar perubahan admin langsung tampil di web publik');
