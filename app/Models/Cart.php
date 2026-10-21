<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property int $total_quantity
 * @property int $total_price
 * @property-read \Illuminate\Database\Eloquent\Collection<CartItem> $items
 * @property-read User $user
 */
class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_quantity',
        'total_price',
    ];

    protected $casts = [
        'total_quantity' => 'integer',
        'total_price' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class)->orderBy('id');
    }

    public function recalculateTotals(): void
    {
        $items = $this->items()->get();
        $totalQty = 0;
        $totalPrice = 0;

        foreach ($items as $item) {
            $product = $item->product;
            $price = $product?->price ?? $item->unit_price ?? 0;
            $qty = max(1, (int) $item->quantity);

            $item->unit_price = $price;
            $item->subtotal_price = $price * $qty;
            $item->saveQuietly();

            $totalQty += $qty;
            $totalPrice += $item->subtotal_price;
        }

        $this->total_quantity = $totalQty;
        $this->total_price = $totalPrice;
        $this->saveQuietly();
    }
}
