<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Validation\Rule;

/**
 * @mixin Builder
 * @method static Builder where($column, $operator = null, $value = null, $boolean = 'and')
 */
class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'name',
        'city',
        'rating',
        'review',
        'is_approved',
    ];

    protected $casts = [
        'rating'     => 'integer',
        'is_approved'=> 'boolean',
        'product_id' => 'integer', // NOT NULL — review wajib terhubung ke produk
    ];

    public static function validationRules(array $overrides = []): array
    {
        return array_merge([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'name'       => ['required', 'string', 'min:2', 'max:100'],
            'city'       => ['nullable', 'string', 'max:100'],
            'rating'     => ['required', 'integer', 'min:1', 'max:5'],
            'review'     => ['required', 'string', 'min:10', 'max:2000'],
            'is_approved'=> ['boolean'],
        ], $overrides);
    }

    protected static function booted()
    {
        static::creating(function (Review $review) {
            $rating = (int) $review->rating;
            if ($rating < 1) {
                $rating = 1;
            }
            if ($rating > 5) {
                $rating = 5;
            }
            $review->rating = $rating;

            $cityStr = is_string($review->city) ? $review->city : '';
            if (trim($cityStr) === '') {
                $review->city = 'Indonesia';
            }

            $nameStr = is_string($review->name) ? $review->name : '';
            if (trim($nameStr) === '') {
                $review->name = 'Pelanggan';
            }

            // Review dari publik selalu butuh persetujuan admin
            if (! isset($review->is_approved)) {
                $review->is_approved = false;
            }
        });

        static::updating(function (Review $review) {
            $cityStr = is_string($review->city) ? $review->city : '';
            if (trim($cityStr) === '') {
                $review->city = 'Indonesia';
            }

            $nameStr = is_string($review->name) ? $review->name : '';
            if (trim($nameStr) === '') {
                $review->name = 'Pelanggan';
            }
        });
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getAuthorNameAttribute(): string
    {
        return $this->name ?? 'Pelanggan';
    }

    public function getBodyAttribute(): string
    {
        return $this->review ?? '';
    }
}
