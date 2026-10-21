<?php

namespace App\Observers;

use App\Models\ProductImage;
use App\Services\ImageService;
use Illuminate\Support\Facades\DB;

class ProductImageObserver
{
    public function __construct(
        protected ImageService $imageService
    ) {}

    public function saved(ProductImage $productImage): void
    {
        $this->ensureSinglePrimary($productImage);
    }

    public function deleted(ProductImage $productImage): void
    {
        if (!empty($productImage->url)) {
            try {
                $this->imageService->deleteIfExists($productImage->url);
            } catch (\Throwable) {
            }
        }

        rescue(function () use ($productImage) {
            DB::afterCommit(function () use ($productImage) {
                $hasPrimary = ProductImage::where('product_id', $productImage->product_id)
                    ->where('is_primary', true)
                    ->exists();

                if (!$hasPrimary) {
                    $firstImg = ProductImage::where('product_id', $productImage->product_id)
                        ->orderBy('sort_order')
                        ->orderBy('id')
                        ->first();

                    if ($firstImg) {
                        $firstImg->is_primary = true;
                        $firstImg->saveQuietly();
                    }
                }
            });
        });
    }

    private function ensureSinglePrimary(ProductImage $productImage): void
    {
        if (!$productImage->is_primary) {
            return;
        }

        rescue(function () use ($productImage) {
            ProductImage::where('product_id', $productImage->product_id)
                ->where('id', '!=', $productImage->id)
                ->where('is_primary', true)
                ->update(['is_primary' => false]);
        });
    }
}
