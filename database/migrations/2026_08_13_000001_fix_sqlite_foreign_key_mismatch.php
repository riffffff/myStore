<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::getDriverName();
        if ($driver !== 'sqlite') {
            return;
        }

        DB::statement('PRAGMA foreign_keys = OFF');

        $hasCorrectPk = DB::selectOne("SELECT sql FROM sqlite_master WHERE type='table' AND name='products'");
        if ($hasCorrectPk && str_contains($hasCorrectPk->sql ?? '', 'PRIMARY KEY')) {
            DB::statement('PRAGMA foreign_keys = ON');
            return;
        }

        DB::statement("CREATE TABLE products_fixed (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL,
            category VARCHAR(255) DEFAULT NULL,
            description TEXT NOT NULL,
            short_description VARCHAR(255) NOT NULL,
            dimensions TEXT DEFAULT NULL,
            materials TEXT DEFAULT NULL,
            finishes TEXT DEFAULT NULL,
            tags TEXT DEFAULT NULL,
            weight_kg NUMERIC(8, 2) DEFAULT NULL,
            assembly_required TINYINT(1) NOT NULL DEFAULT 0,
            warranty_months INTEGER DEFAULT NULL,
            is_published TINYINT(1) NOT NULL DEFAULT 1,
            price INTEGER NOT NULL,
            stock_status VARCHAR(255) NOT NULL DEFAULT 'available',
            created_at DATETIME DEFAULT NULL,
            updated_at DATETIME DEFAULT NULL,
            UNIQUE (slug)
        )");

        DB::statement("INSERT INTO products_fixed (id, name, slug, category, description, short_description, dimensions, materials, finishes, tags, weight_kg, assembly_required, warranty_months, is_published, price, stock_status, created_at, updated_at)
            SELECT id, name, slug, category, description, short_description, dimensions, materials, finishes, tags, weight_kg, assembly_required, warranty_months, is_published, price, stock_status, created_at, updated_at
            FROM products");

        $maxId = (int) DB::table('products_fixed')->max('id');
        if ($maxId > 0) {
            DB::statement("DELETE FROM sqlite_sequence WHERE name='products_fixed'");
            DB::statement("INSERT INTO sqlite_sequence (name, seq) VALUES ('products_fixed', ?)", [$maxId]);
        }

        DB::statement('DROP TABLE IF EXISTS products');
        DB::statement('ALTER TABLE products_fixed RENAME TO products');

        $imgTableCheck = DB::selectOne("SELECT sql FROM sqlite_master WHERE type='table' AND name='product_images'");
        if (!$imgTableCheck || !str_contains($imgTableCheck->sql ?? '', 'FOREIGN KEY')) {
            DB::statement("CREATE TABLE product_images_fixed (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                product_id BIGINT UNSIGNED NOT NULL,
                url VARCHAR(255) NOT NULL,
                is_primary TINYINT(1) NOT NULL DEFAULT 0,
                sort_order INTEGER NOT NULL DEFAULT 0,
                created_at DATETIME DEFAULT NULL,
                updated_at DATETIME DEFAULT NULL,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )");
            DB::statement("INSERT INTO product_images_fixed (id, product_id, url, is_primary, sort_order, created_at, updated_at)
                SELECT id, product_id, url, is_primary, sort_order, created_at, updated_at FROM product_images");
            DB::statement('DROP TABLE IF EXISTS product_images');
            DB::statement('ALTER TABLE product_images_fixed RENAME TO product_images');
        }

        DB::statement('PRAGMA foreign_keys_check');
        DB::statement('PRAGMA foreign_keys = ON');
    }

    public function down(): void
    {
        //
    }
};
