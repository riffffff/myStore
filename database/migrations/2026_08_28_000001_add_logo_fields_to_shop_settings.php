<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            $table->string('logo')->nullable()->after('shop_name');
            $table->string('logo_dark')->nullable()->after('logo');
            $table->string('favicon')->nullable()->after('logo_dark');
        });
    }

    public function down(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            $table->dropColumn(['logo', 'logo_dark', 'favicon']);
        });
    }
};
