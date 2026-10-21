<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_images', function (Blueprint $table) {
            if (!Schema::hasColumn('product_images', 'sort_order')) {
                $table->unsignedInteger('sort_order')->default(0)->after('is_primary');
            }
        });
    }

    public function down(): void
    {
        Schema::table('product_images', function (Blueprint $table) {
            if (Schema::hasColumn('product_images', 'sort_order')) {
                $table->dropColumn('sort_order');
            }
        });
    }
};
