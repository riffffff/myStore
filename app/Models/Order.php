<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'customer_name',
        'customer_address',
        'customer_phone',
        'payment_method',
        'payment_proof',
        'status',
        'total_price',
        'notes',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
    ];

    protected $appends = [
        'payment_proof_url',
    ];

    public function getPaymentProofUrlAttribute(): ?string
    {
        return $this->payment_proof ? asset('storage/' . $this->payment_proof) : null;
    }

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            if (empty($order->order_number)) {
                $order->order_number = 'ORD-' . strtoupper(Str::random(8)) . '-' . now()->format('dmy');
            }
        });
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
