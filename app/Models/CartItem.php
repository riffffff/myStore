<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $cart_id
 * @property int $product_id
 * @property int $quantity
 * @property int $unit_price
 * @property int $subtotal_price
 * @property-read Cart $cart
 * @property-read Product $product
 */
class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
        'unit_price',
        'subtotal_price',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'integer',
        'subtotal_price' => 'integer',
    ];

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    protected static function booted()
    {
        static::saved(function (self $item) {
            if ($item->cart_id) {
                rescue(fn () => $item->cart?->recalculateTotals());
            }
        });

        static::deleted(function (self $item) {
            if ($item->cart_id) {
                rescue(fn () => Cart::find($item->cart_id)?->recalculateTotals());
            }
        });
    }
}
