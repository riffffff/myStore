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

        DB::statement('DELETE FROM reviews WHERE rating < 1 OR rating > 5;');

        if ($driver !== 'sqlite') {
            DB::statement('ALTER TABLE reviews ADD CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5);');
        }

        $settingsCount = DB::table('shop_settings')->count();
        if ($settingsCount > 1) {
            DB::statement('DELETE FROM shop_settings WHERE id != (SELECT MIN(id) FROM shop_settings);');
        }
    }

    public function down(): void
    {
        $driver = DB::getDriverName();
        if ($driver !== 'sqlite') {
            DB::statement('ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_rating_check;');
        }
    }
};
