<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\ShopSetting;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('shop_settings', 'price_color')) {
                $table->string('price_color')->default('#E63854')->after('card_product_price_color');
            }
        });

        // Update nilai warna harga di record existing agar konsisten menggunakan #E63854
        DB::table('shop_settings')->update([
            'card_product_price_color' => '#E63854',
            'price_color'              => '#E63854',
        ]);

        ShopSetting::flushCache();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            if (Schema::hasColumn('shop_settings', 'price_color')) {
                $table->dropColumn('price_color');
            }
        });

        DB::table('shop_settings')->update([
            'card_product_price_color' => '#262626',
        ]);

        ShopSetting::flushCache();
    }
};
