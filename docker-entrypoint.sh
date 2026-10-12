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
chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache

# Jika .env belum ada, copy dari .env.example
if [ ! -f /var/www/html/.env ]; then
    cp /var/www/html/.env.example /var/www/html/.env
fi

# Generate app key jika belum ada
if ! grep -q "APP_KEY=base64" /var/www/html/.env; then
    php artisan key:generate --force || true
fi

# Link storage jika belum ada
php artisan storage:link --force || true

# Jalankan migrasi database
php artisan migrate --force || true

echo "=========================================="
echo "🚀 Store Application running on port 8002!"
echo "🌐 URL: http://localhost:8002"
echo "=========================================="

exec php artisan serve --host=0.0.0.0 --port=8002
