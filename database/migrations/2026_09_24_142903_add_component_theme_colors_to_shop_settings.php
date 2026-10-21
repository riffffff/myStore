<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Menambahkan kolom pewarnaan berbasis komponen (Header, Footer, Card Product, Card Article, Hero, Page).
     */
    public function up(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            // ── Header Component ──────────────────────────────────────────
            $table->string('header_bg_color')->default('#333333')->after('theme_dark_mode_enabled');
            $table->string('header_text_color')->default('#FFFFFF')->after('header_bg_color');
            $table->string('header_active_color')->default('#0D9488')->after('header_text_color');

            // ── Footer Component ──────────────────────────────────────────
            $table->string('footer_bg_color')->default('#333333')->after('header_active_color');
            $table->string('footer_text_color')->default('#FFFFFF')->after('footer_bg_color');
            $table->string('footer_accent_color')->default('#0D9488')->after('footer_text_color');

            // ── Hero Section ──────────────────────────────────────────────
            $table->string('hero_bg_color')->default('#F1F1F1')->after('footer_accent_color');
            $table->string('hero_text_color')->default('#262626')->after('hero_bg_color');
            $table->string('hero_btn_color')->default('#0D9488')->after('hero_text_color');
            $table->string('hero_btn_text_color')->default('#FFFFFF')->after('hero_btn_color');

            // ── Card Product ──────────────────────────────────────────────
            $table->string('card_product_bg_color')->default('#FFFFFF')->after('hero_btn_text_color');
            $table->string('card_product_border_color')->default('#E5E7EB')->after('card_product_bg_color');
            $table->string('card_product_text_color')->default('#262626')->after('card_product_border_color');
            $table->string('card_product_price_color')->default('#262626')->after('card_product_text_color');
            $table->string('card_product_btn_color')->default('#0D9488')->after('card_product_price_color');

            // ── Card Article ──────────────────────────────────────────────
            $table->string('card_article_bg_color')->default('#FFFFFF')->after('card_product_btn_color');
            $table->string('card_article_border_color')->default('#E5E7EB')->after('card_article_bg_color');
            $table->string('card_article_tag_color')->default('#0D9488')->after('card_article_border_color');
            $table->string('card_article_title_color')->default('#262626')->after('card_article_tag_color');
            $table->string('card_article_text_color')->default('#4B5563')->after('card_article_title_color');

            // ── Page & Global Buttons ─────────────────────────────────────
            $table->string('page_bg_color')->default('#FFFFFF')->after('card_article_text_color');
            $table->string('page_text_color')->default('#262626')->after('page_bg_color');
            $table->string('primary_btn_color')->default('#0D9488')->after('page_text_color');
            $table->string('primary_btn_text_color')->default('#FFFFFF')->after('primary_btn_color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            $table->dropColumn([
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
};
