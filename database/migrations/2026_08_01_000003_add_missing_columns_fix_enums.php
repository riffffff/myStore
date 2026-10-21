<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'category')) {
                $table->string('category')->nullable()->after('slug');
            }
            if (!Schema::hasColumn('products', 'dimensions')) {
                $table->json('dimensions')->nullable()->after('description');
            }
            if (!Schema::hasColumn('products', 'materials')) {
                $table->json('materials')->nullable()->after('dimensions');
            }
            if (!Schema::hasColumn('products', 'finishes')) {
                $table->json('finishes')->nullable()->after('materials');
            }
            if (!Schema::hasColumn('products', 'tags')) {
                $table->json('tags')->nullable()->after('finishes');
            }
            if (!Schema::hasColumn('products', 'weight_kg')) {
                $table->decimal('weight_kg', 8, 2)->nullable()->after('tags');
            }
            if (!Schema::hasColumn('products', 'assembly_required')) {
                $table->boolean('assembly_required')->default(false)->after('weight_kg');
            }
            if (!Schema::hasColumn('products', 'warranty_months')) {
                $table->integer('warranty_months')->nullable()->after('assembly_required');
            }
            if (!Schema::hasColumn('products', 'is_published')) {
                $table->boolean('is_published')->default(true)->after('warranty_months');
            }
        });

        $driver = DB::getDriverName();
        if ($driver !== 'sqlite') {
            DB::statement("ALTER TABLE products MODIFY COLUMN stock_status ENUM('available', 'preorder', 'out_of_stock') NOT NULL DEFAULT 'available'");
        } else {
            DB::statement('PRAGMA foreign_keys = OFF');
            DB::statement("CREATE TABLE products_new (
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
            DB::statement("INSERT INTO products_new (id, name, slug, category, description, short_description, dimensions, materials, finishes, tags, weight_kg, assembly_required, warranty_months, is_published, price, stock_status, created_at, updated_at)
                SELECT p.id, p.name, p.slug, NULL, p.description, p.short_description, NULL, NULL, NULL, NULL, NULL, 0, NULL, 1, p.price,
                CASE
                    WHEN p.stock_status = 'ready_stock' THEN 'available'
                    WHEN p.stock_status = 'pre_order' THEN 'preorder'
                    ELSE p.stock_status
                END, p.created_at, p.updated_at
                FROM products p");
            $maxId = (int) DB::table('products_new')->max('id');
            if ($maxId > 0) {
                DB::statement("DELETE FROM sqlite_sequence WHERE name='products_new'");
                DB::statement("INSERT INTO sqlite_sequence (name, seq) VALUES ('products_new', ?)", [$maxId]);
            }
            DB::statement('DROP TABLE products');
            DB::statement('ALTER TABLE products_new RENAME TO products');
            DB::statement('PRAGMA foreign_keys_check');
            DB::statement('PRAGMA foreign_keys = ON');
        }

        DB::table('products')->where('stock_status', 'ready_stock')->update(['stock_status' => 'available']);
        DB::table('products')->where('stock_status', 'pre_order')->update(['stock_status' => 'preorder']);

        Schema::table('articles', function (Blueprint $table) {
            if (!Schema::hasColumn('articles', 'is_published')) {
                $table->boolean('is_published')->default(true)->after('is_hero');
            }
        });

        Schema::table('reviews', function (Blueprint $table) {
            if (!Schema::hasColumn('reviews', 'product_id')) {
                $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete()->after('id');
            }
            if (!Schema::hasColumn('reviews', 'is_approved')) {
                $table->boolean('is_approved')->default(true)->after('review');
            }
        });

        Schema::table('shop_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('shop_settings', 'shop_name')) {
                $table->string('shop_name')->nullable()->after('id');
            }
            if (!Schema::hasColumn('shop_settings', 'address')) {
                $table->text('address')->nullable()->after('shop_name');
            }
            if (!Schema::hasColumn('shop_settings', 'operating_hours')) {
                $table->string('operating_hours')->nullable()->after('whatsapp_template');
            }
            if (!Schema::hasColumn('shop_settings', 'hero_banner_text_1')) {
                $table->string('hero_banner_text_1')->nullable()->after('operating_hours');
            }
            if (!Schema::hasColumn('shop_settings', 'hero_banner_text_2')) {
                $table->string('hero_banner_text_2')->nullable()->after('hero_banner_text_1');
            }
            if (!Schema::hasColumn('shop_settings', 'hero_banner_bg')) {
                $table->string('hero_banner_bg')->nullable()->after('hero_banner_text_2');
            }
            if (!Schema::hasColumn('shop_settings', 'shipping_areas')) {
                $table->json('shipping_areas')->nullable()->after('hero_banner_bg');
            }
            if (!Schema::hasColumn('shop_settings', 'shipping_estimate_days')) {
                $table->string('shipping_estimate_days')->nullable()->after('shipping_areas');
            }
        });
    }

    public function down(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            $columns = ['shipping_estimate_days', 'shipping_areas', 'hero_banner_bg', 'hero_banner_text_2', 'hero_banner_text_1', 'operating_hours', 'address', 'shop_name'];
            foreach ($columns as $col) {
                if (Schema::hasColumn('shop_settings', $col)) {
                    $table->dropColumn($col);
                }
            }
        });

        Schema::table('reviews', function (Blueprint $table) {
            if (Schema::hasColumn('reviews', 'is_approved')) {
                $table->dropColumn('is_approved');
            }
            if (Schema::hasColumn('reviews', 'product_id')) {
                $table->dropConstrainedForeignId('product_id');
            }
        });

        Schema::table('articles', function (Blueprint $table) {
            if (Schema::hasColumn('articles', 'is_published')) {
                $table->dropColumn('is_published');
            }
        });

        $driver = DB::getDriverName();
        if ($driver !== 'sqlite') {
            DB::statement("ALTER TABLE products MODIFY COLUMN stock_status ENUM('ready_stock', 'pre_order') NOT NULL");
        }

        DB::table('products')->where('stock_status', 'available')->update(['stock_status' => 'ready_stock']);
        DB::table('products')->where('stock_status', 'preorder')->update(['stock_status' => 'pre_order']);

        Schema::table('products', function (Blueprint $table) {
            $columns = ['is_published', 'warranty_months', 'assembly_required', 'weight_kg', 'tags', 'finishes', 'materials', 'dimensions', 'category'];
            foreach ($columns as $col) {
                if (Schema::hasColumn('products', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
