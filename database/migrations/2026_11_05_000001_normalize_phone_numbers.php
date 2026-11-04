<?php

use App\Models\Order;
use App\Models\ShopSetting;
use App\Models\User;
use App\Support\PhoneNumber;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Normalisasi nomor telepon users
        $users = User::whereNotNull('phone')->get();
        foreach ($users as $user) {
            $normalized = PhoneNumber::normalize($user->phone);
            if (! $normalized) {
                continue;
            }

            // Cek apakah nomor yang sudah dinormalisasi sudah dimiliki user lain
            $conflict = User::where('phone', $normalized)
                ->where('id', '!=', $user->id)
                ->first();

            if ($conflict) {
                Log::warning("Migration normalize_phone_numbers: Conflict user id {$user->id} phone {$user->phone} -> {$normalized} with user id {$conflict->id}. Setting phone to null.");
                $user->phone = null;
            } else {
                $user->phone = $normalized;

                // Jika user memakai email dummy @customer.local, perbarui emailnya
                if (str_ends_with((string) $user->email, '@customer.local')) {
                    $newEmail = $normalized . '@customer.local';
                    $emailConflict = User::where('email', $newEmail)
                        ->where('id', '!=', $user->id)
                        ->exists();

                    if (! $emailConflict) {
                        $user->email = $newEmail;
                    }
                }
            }

            $user->save();
        }

        // 2. Normalisasi nomor telepon orders
        $orders = Order::whereNotNull('customer_phone')->get();
        foreach ($orders as $order) {
            $normalized = PhoneNumber::normalize($order->customer_phone);
            if ($normalized && $normalized !== $order->customer_phone) {
                $order->customer_phone = $normalized;
                $order->save();
            }
        }

        // 3. Normalisasi nomor whatsapp toko
        $settings = ShopSetting::first();
        if ($settings && ! empty($settings->whatsapp_number)) {
            $normalized = PhoneNumber::normalize($settings->whatsapp_number);
            if ($normalized) {
                $settings->whatsapp_number = $normalized;
                $settings->save();
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Normalisasi bersifat satu arah, no-op
    }
};
