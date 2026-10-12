<?php

namespace App\Filament\Resources\ShopSettingResource\Pages;

use App\Filament\Resources\ShopSettingResource;
use App\Models\ShopSetting;
use App\Services\ImageService;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Cache;

class EditShopSetting extends EditRecord
{
    protected static string $resource = ShopSettingResource::class;

    /** Nilai default untuk semua field warna komponen */
    private const COLOR_DEFAULTS = [
        // Header
        'header_bg_color'           => '#333333',
        'header_text_color'         => '#FFFFFF',
        'header_active_color'       => '#0D9488',
        // Footer
        'footer_bg_color'           => '#333333',
        'footer_text_color'         => '#FFFFFF',
        'footer_accent_color'       => '#0D9488',
        // Hero Section
        'hero_bg_color'             => '#F1F1F1',
        'hero_text_color'           => '#262626',
        'hero_btn_color'            => '#0D9488',
        'hero_btn_text_color'       => '#FFFFFF',
        // Card Produk
        'card_product_bg_color'     => '#FFFFFF',
        'card_product_border_color' => '#E5E7EB',
        'card_product_text_color'   => '#262626',
        'card_product_price_color'  => '#262626',
        'card_product_btn_color'    => '#0D9488',
        // Card Artikel
        'card_article_bg_color'     => '#FFFFFF',
        'card_article_border_color' => '#E5E7EB',
        'card_article_tag_color'    => '#0D9488',
        'card_article_title_color'  => '#262626',
        'card_article_text_color'   => '#4B5563',
        // Page & Tombol Global
        'page_bg_color'             => '#FFFFFF',
        'page_text_color'           => '#262626',
        'primary_btn_color'         => '#0D9488',
        'primary_btn_text_color'    => '#FFFFFF',
    ];

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('reset_colors')
                ->label('Reset Warna')
                ->icon('heroicon-o-arrow-path')
                ->color('gray')
                ->outlined()
                ->requiresConfirmation()
                ->modalHeading('Reset Semua Warna ke Default?')
                ->modalDescription('Semua pengaturan warna komponen (Header, Footer, Hero, Card Produk, Card Artikel, Tombol) akan dikembalikan ke nilai bawaan. Pengaturan lain tidak terpengaruh.')
                ->modalSubmitActionLabel('Ya, Reset Warna')
                ->modalIcon('heroicon-o-paint-brush')
                ->action(function () {
                    /** @var ShopSetting $record */
                    $record = $this->record;

                    $record->fill(self::COLOR_DEFAULTS)->save();

                    Cache::forget(ShopSetting::CACHE_KEY);

                    Notification::make()
                        ->title('Warna berhasil direset ke default!')
                        ->success()
                        ->send();

                    $this->fillForm();
                }),

            Actions\Action::make('back_to_list')
                ->label('Kembali')
                ->icon('heroicon-o-arrow-left')
                ->color('gray')
                ->outlined()
                ->url(fn () => ShopSettingResource::getUrl('index')),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        /** @var ImageService $imageService */
        $imageService = app(ImageService::class);

        foreach (['logo', 'logo_dark', 'favicon', 'hero_banner_bg'] as $field) {
            if (!empty($data[$field]) && is_string($data[$field])) {
                $data[$field] = $imageService->processUploadedPath($data[$field], 'branding') ?? $data[$field];
            }
        }

        return $data;
    }

    protected function getRedirectUrl(): string
    {
        return ShopSettingResource::getUrl('edit', ['record' => $this->record]);
    }

    protected function afterSave(): void
    {
        // Bersihkan cache setelah admin menyimpan perubahan
        Cache::forget(ShopSetting::CACHE_KEY);
    }
}
