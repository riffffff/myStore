<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * @mixin Builder
 * @method static Builder where($column, $operator = null, $value = null, $boolean = 'and')
 */
class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'description',
        'short_description',
        'price',
        'original_price',
        'stock_status',
        'dimensions',
        'materials',
        'finishes',
        'tags',
        'weight_kg',
        'assembly_required',
        'warranty_months',
        'is_published',
        'views_count',
    ];

    protected $casts = [
        'dimensions' => 'array',
        'materials' => 'array',
        'finishes' => 'array',
        'tags' => 'array',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'weight_kg' => 'decimal:2',
        'assembly_required' => 'boolean',
        'is_published' => 'boolean',
        'views_count' => 'integer',
    ];

    /**
     * Increment view counter secara atomic tanpa menyentuh timestamps.
     * Menggunakan DB::table() langsung untuk menghindari race condition.
     */
    public function incrementView(): void
    {
        DB::table($this->getTable())
            ->where('id', $this->id)
            ->increment('views_count');

        // Sync nilai di memory agar konsisten jika model dipakai lagi
        $this->views_count = ($this->views_count ?? 0) + 1;
    }

    protected static function booted()
    {
        static::creating(function (Product $product) {
            if (empty($product->slug)) {
                $baseSlug = Str::slug($product->name);
                $suffix = Str::random(5);
                $slug = "{$baseSlug}-{$suffix}";
                $counter = 1;
                while (static::where('slug', $slug)->exists()) {
                    $slug = "{$baseSlug}-{$suffix}-{$counter}";
                    $counter++;
                }
                $product->slug = $slug;
            }
        });

        static::updating(function (Product $product) {
            $original = $product->getOriginal();
            if (!empty($original['slug'])) {
                $product->slug = $original['slug'];
            } elseif (empty($product->slug)) {
                $baseSlug = Str::slug($product->name);
                $suffix = Str::random(5);
                $slug = "{$baseSlug}-{$suffix}";
                $counter = 1;
                while (static::where('slug', $slug)->exists()) {
                    $slug = "{$baseSlug}-{$suffix}-{$counter}";
                    $counter++;
                }
                $product->slug = $slug;
            }
        });
    }

    /**
     * @return HasMany<ProductImage>
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order')->orderBy('id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne<ProductImage>
     */
    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    /**
     * @return HasMany<Review>
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class)->where('is_approved', true)->latest();
    }

    /**
     * @return HasMany<Review>
     */
    public function allReviews(): HasMany
    {
        return $this->hasMany(Review::class)->latest();
    }
}
