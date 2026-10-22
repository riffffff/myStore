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
        Schema::create('theme_settings', function (Blueprint $table) {
            $table->id();
            
            // Global Colors
            $table->string('primary_color')->default('#0D9488');
            $table->string('secondary_color')->default('#333333');
            $table->string('accent_color')->default('#0D9488');
            $table->string('background_color')->default('#FFFFFF');
            $table->string('background_dark_color')->default('#1A1A1A');
            $table->string('text_color')->default('#262626');
            $table->string('text_light_color')->default('#6B7280');
            $table->string('success_color')->default('#10B981');
            $table->string('error_color')->default('#E63854');
            $table->string('warning_color')->default('#F59E0B');
            $table->string('info_color')->default('#0D9488');

            // Options
            $table->string('border_radius')->default('0.75rem');
            $table->string('font_family')->default('Inter');
            $table->boolean('dark_mode_enabled')->default(true);

            // Component-specific theme colors
            $table->string('header_bg_color')->nullable();
            $table->string('header_text_color')->nullable();
            $table->string('header_active_color')->nullable();
            $table->string('footer_bg_color')->nullable();
            $table->string('footer_text_color')->nullable();
            $table->string('footer_accent_color')->nullable();
            $table->string('hero_bg_color')->nullable();
            $table->string('hero_text_color')->nullable();
            $table->string('hero_btn_color')->nullable();
            $table->string('hero_btn_text_color')->nullable();
            $table->string('card_product_bg_color')->nullable();
            $table->string('card_product_border_color')->nullable();
            $table->string('card_product_text_color')->nullable();
            $table->string('card_product_price_color')->nullable();
            $table->string('price_color')->nullable();
            $table->string('card_product_btn_color')->nullable();
            $table->string('card_article_bg_color')->nullable();
            $table->string('card_article_border_color')->nullable();
            $table->string('card_article_tag_color')->nullable();
            $table->string('card_article_title_color')->nullable();
            $table->string('card_article_text_color')->nullable();
            $table->string('page_bg_color')->nullable();
            $table->string('page_text_color')->nullable();
            $table->string('primary_btn_color')->nullable();
            $table->string('primary_btn_text_color')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('theme_settings');
    }
};
