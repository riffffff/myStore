<?php

namespace App\Observers;

use App\Models\ShopSetting;
use App\Services\ImageService;

class ShopSettingObserver
{
    protected array $oldPaths = [];

    public function __construct(
        protected ImageService $imageService
    ) {}

    public function updating(ShopSetting $setting): void
    {
        $this->oldPaths = [];
        $fields = ['logo', 'logo_dark', 'favicon'];

        foreach ($fields as $field) {
            if ($setting->isDirty($field)) {
                $oldValue = $setting->getOriginal($field);
                $newValue = $setting->getAttribute($field);
                if (
                    !empty($oldValue)
                    && $oldValue !== $newValue
                ) {
                    $this->oldPaths[$field] = $oldValue;
                }
            }
        }
    }

    public function saved(ShopSetting $setting): void
    {
        foreach ($this->oldPaths as $oldPath) {
            try {
                $this->imageService->deleteIfExists($oldPath);
            } catch (\Throwable) {
            }
        }
        $this->oldPaths = [];

        rescue(function () use ($setting) {
            cache()->forget('shop_settings');
            cache()->forget('shop_settings:data');
        });
    }
}
