<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('shop_settings', 'hero_banner_bg_mobile')) {
                $table->string('hero_banner_bg_mobile')->nullable()->after('hero_banner_bg');
            }
        });
    }

    public function down(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            if (Schema::hasColumn('shop_settings', 'hero_banner_bg_mobile')) {
                $table->dropColumn('hero_banner_bg_mobile');
            }
        });
    }
};

