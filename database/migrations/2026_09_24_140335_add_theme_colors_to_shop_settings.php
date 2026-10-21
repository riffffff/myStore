<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Menambahkan kolom tema untuk sistem Theme Customization PaiTech.
     */
    public function up(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            // ── Theme Colors ─────────────────────────────────────────────────
            $table->string('theme_primary_color')->default('#3B82F6');          // Blue-500
            $table->string('theme_secondary_color')->default('#8B5CF6');        // Violet-500
            $table->string('theme_accent_color')->default('#F59E0B');           // Amber-500
            $table->string('theme_background_color')->default('#FFFFFF');       // White
            $table->string('theme_background_dark_color')->default('#111827'); // Gray-900
            $table->string('theme_text_color')->default('#1F2937');             // Gray-800
            $table->string('theme_text_light_color')->default('#6B7280');       // Gray-500
            $table->string('theme_success_color')->default('#10B981');          // Green-500
            $table->string('theme_error_color')->default('#EF4444');            // Red-500
            $table->string('theme_warning_color')->default('#F59E0B');          // Amber-500
            $table->string('theme_info_color')->default('#3B82F6');             // Blue-500

            // ── Additional Theme Options ──────────────────────────────────────
            $table->string('theme_border_radius')->default('0.5rem');           // 8px (Medium)
            $table->string('theme_font_family')->default('inter');              // Font slug
            $table->boolean('theme_dark_mode_enabled')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            $table->dropColumn([
                'theme_primary_color',
                'theme_secondary_color',
                'theme_accent_color',
                'theme_background_color',
                'theme_background_dark_color',
                'theme_text_color',
                'theme_text_light_color',
                'theme_success_color',
                'theme_error_color',
                'theme_warning_color',
                'theme_info_color',
                'theme_border_radius',
                'theme_font_family',
                'theme_dark_mode_enabled',
            ]);
        });
    }
};
