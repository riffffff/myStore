<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

/**
 * Service for review-related business logic.
 *
 * Handles review creation, retrieval, and validation.
 */
class ReviewService
{
    /**
     * Create a new review.
     *
     * @throws ValidationException
     */
    public function createReview(array $data): Review
    {
        // Validate product exists and is published
        $this->validateProduct($data['product_id']);

        return Review::create([
            'product_id' => $data['product_id'],
            'name' => $data['name'],
            'city' => $data['city'] ?? null,
            'rating' => (int) $data['rating'],
            'review' => $data['review'],
            'is_approved' => false, // Always requires moderation
        ]);
    }

    /**
     * Get approved reviews with limit.
     */
    public function getApprovedReviews(int $limit = 9): Collection
    {
        return Review::where('is_approved', true)
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get();
    }

    /**
     * Get reviews for a specific product.
     */
    public function getProductReviews(int $productId, bool $approvedOnly = true): Collection
    {
        $query = Review::where('product_id', $productId);

        if ($approvedOnly) {
            $query->where('is_approved', true);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Validate product exists and is published.
     *
     * @throws ValidationException
     */
    private function validateProduct(int $productId): Product
    {
        $product = Product::where('id', $productId)
            ->where('is_published', true)
            ->first();

        if (! $product) {
            throw ValidationException::withMessages([
                'product_id' => ['Produk tidak ditemukan.'],
            ]);
        }

        return $product;
    }
}
