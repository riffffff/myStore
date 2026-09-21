<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Service for product-related business logic.
 *
 * Handles product listing, filtering, sorting, and view tracking.
 */
class ProductService
{
    /**
     * Get published products with filters and pagination.
     *
     * @param  array  $filters  Available filters: stock_status, sort, search
     * @param  int  $perPage  Number of items per page
     */
    public function getPublishedProducts(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = Product::with(['images' => function ($query) {
            $query->where('is_primary', true);
        }])->where('is_published', true);

        // Apply stock status filter
        if (! empty($filters['stock_status'])) {
            $this->applyStockStatusFilter($query, $filters['stock_status']);
        }

        // Apply search filter
        if (! empty($filters['search'])) {
            $this->applySearchFilter($query, $filters['search']);
        }

        // Apply sorting
        $this->applySorting($query, $filters['sort'] ?? 'newest');

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Get single product by slug.
     *
     * @throws ModelNotFoundException
     */
    public function getProductBySlug(string $slug): Product
    {
        return Product::with('images')
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();
    }

    /**
     * Increment product view count.
     */
    public function incrementProductView(Product $product): void
    {
        $product->incrementView();
    }

    /**
     * Get top products (newest).
     */
    public function getTopProducts(int $limit = 8): Collection
    {
        return Product::with(['images' => function ($query) {
            $query->where('is_primary', true);
        }])
            ->where('is_published', true)
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get();
    }

    /**
     * Apply stock status filter to query.
     */
    private function applyStockStatusFilter(Builder $query, string $status): void
    {
        $allowedStatus = ['available', 'preorder', 'out_of_stock'];

        if (in_array($status, $allowedStatus, true)) {
            $query->where('stock_status', $status);
        }
    }

    /**
     * Apply search filter to query.
     */
    private function applySearchFilter(Builder $query, string $search): void
    {
        $query->where(function (Builder $q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        });
    }

    /**
     * Apply sorting to query.
     */
    private function applySorting(Builder $query, string $sort): void
    {
        match ($sort) {
            'price_low' => $query->orderBy('price', 'asc'),
            'price_high' => $query->orderBy('price', 'desc'),
            'popular' => $query->orderBy('view_count', 'desc'),
            default => $query->orderBy('created_at', 'desc'),
        };
    }
}
