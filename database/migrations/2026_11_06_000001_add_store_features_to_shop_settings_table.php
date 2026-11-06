<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('shop_settings', 'store_features')) {
                $table->json('store_features')->nullable()->after('operating_hours');
            }
        });
    }

    public function down(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            if (Schema::hasColumn('shop_settings', 'store_features')) {
                $table->dropColumn('store_features');
            }
        });
    }
};
