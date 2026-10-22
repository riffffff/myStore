<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            $table->dropColumn([
                // Theme colors
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

                // Theme options
                'theme_border_radius',
                'theme_font_family',
                'theme_dark_mode_enabled',

                // Component-specific theme colors
                'header_bg_color',
                'header_text_color',
                'header_active_color',
                'footer_bg_color',
                'footer_text_color',
                'footer_accent_color',
                'hero_bg_color',
                'hero_text_color',
                'hero_btn_color',
                'hero_btn_text_color',
                'card_product_bg_color',
                'card_product_border_color',
                'card_product_text_color',
                'card_product_price_color',
                'price_color',
                'card_product_btn_color',
                'card_article_bg_color',
                'card_article_border_color',
                'card_article_tag_color',
                'card_article_title_color',
                'card_article_text_color',
                'page_bg_color',
                'page_text_color',
                'primary_btn_color',
                'primary_btn_text_color',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            // Re-add columns if needed (skipped for brevity as we are refactoring)
        });
    }
};
