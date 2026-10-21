<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Hapus review yatim (product_id = null atau produk sudah tidak ada)
        DB::table('reviews')
            ->whereNull('product_id')
            ->delete();

        DB::table('reviews')
            ->whereNotIn('product_id', DB::table('products')->pluck('id'))
            ->delete();

        $driver = DB::getDriverName();

        if ($driver === 'sqlite') {
            // SQLite tidak mendukung ALTER COLUMN, rekonstruksi tabel
            DB::statement('PRAGMA foreign_keys = OFF');

            DB::statement("CREATE TABLE reviews_fixed (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                product_id BIGINT UNSIGNED NOT NULL,
                name VARCHAR(255) NOT NULL,
                city VARCHAR(255) NOT NULL,
                rating TINYINT NOT NULL,
                review TEXT NOT NULL,
                is_approved TINYINT(1) NOT NULL DEFAULT 0,
                created_at DATETIME DEFAULT NULL,
                updated_at DATETIME DEFAULT NULL,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )");

            DB::statement("INSERT INTO reviews_fixed (id, product_id, name, city, rating, review, is_approved, created_at, updated_at)
                SELECT id, product_id, name, city, rating, review, COALESCE(is_approved, 0), created_at, updated_at
                FROM reviews
                WHERE product_id IS NOT NULL");

            $maxId = (int) DB::table('reviews_fixed')->max('id');
            if ($maxId > 0) {
                DB::statement("DELETE FROM sqlite_sequence WHERE name='reviews_fixed'");
                DB::statement("INSERT INTO sqlite_sequence (name, seq) VALUES ('reviews_fixed', ?)", [$maxId]);
            }

            DB::statement('DROP TABLE reviews');
            DB::statement('ALTER TABLE reviews_fixed RENAME TO reviews');
            DB::statement('PRAGMA foreign_keys = ON');
        } else {
            // MySQL / PostgreSQL: ubah kolom menjadi NOT NULL
            // Cek apakah kolom sudah NOT NULL (fresh install MySQL tidak perlu alter)
            $column = DB::selectOne("
                SELECT IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = 'reviews'
                AND COLUMN_NAME = 'product_id'
            ");

            // Jika sudah NOT NULL, skip
            if ($column && $column->IS_NULLABLE === 'NO') {
                return;
            }

            // Drop semua FK yang mereferensikan product_id di tabel reviews
            $fks = DB::select("
                SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = 'reviews'
                AND COLUMN_NAME = 'product_id'
                AND REFERENCED_TABLE_NAME IS NOT NULL
            ");

            Schema::table('reviews', function (Blueprint $table) use ($fks) {
                foreach ($fks as $fk) {
                    $table->dropForeign($fk->CONSTRAINT_NAME);
                }
            });

            // Ubah kolom jadi NOT NULL dan tambah FK baru
            DB::statement("ALTER TABLE reviews MODIFY product_id BIGINT UNSIGNED NOT NULL");

            Schema::table('reviews', function (Blueprint $table) {
                $table->foreign('product_id')
                    ->references('id')
                    ->on('products')
                    ->cascadeOnDelete();
            });
        }
    }

    public function down(): void
    {
        $driver = DB::getDriverName();

        if ($driver !== 'sqlite') {
            Schema::table('reviews', function (Blueprint $table) {
                $table->dropForeign(['product_id']);
            });

            Schema::table('reviews', function (Blueprint $table) {
                $table->foreignId('product_id')
                    ->nullable()
                    ->change()
                    ->constrained('products')
                    ->nullOnDelete();
            });
        }
    }
};
