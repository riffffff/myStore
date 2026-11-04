#!/bin/bash
set -e

# Pastikan direktori storage dan cache tersedia
mkdir -p /var/www/html/storage/framework/{sessions,views,cache} \
         /var/www/html/storage/logs \
         /var/www/html/bootstrap/cache \
         /var/www/html/storage/app/public/{qris,payment_proofs,branding}

# Pastikan file SQLite ada
if [ ! -f /var/www/html/database/database.sqlite ]; then
    touch /var/www/html/database/database.sqlite
fi

# Set permissions
chown -R www-data:www-data /var/www/html/database /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/database /var/www/html/storage /var/www/html/bootstrap/cache

# Cek APP_KEY (harus terisi di environment atau .env server)
if [ -z "$APP_KEY" ] && (! [ -f /var/www/html/.env ] || ! grep -q "APP_KEY=base64" /var/www/html/.env); then
    echo "ERROR: APP_KEY belum di-set di environment server!"
    echo "Silakan tambahkan APP_KEY=base64:... pada file .env Anda."
    exit 1
fi

# Link storage jika belum ada
php artisan storage:link --force || true

# Jalankan migrasi database
php artisan migrate --force

# Cache konfigurasi untuk performa optimal di production
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "=========================================="
echo "🚀 Store Application running on FrankenPHP port 8002!"
echo "=========================================="

exec frankenphp php-server --listen :8002 --root /var/www/html/public
