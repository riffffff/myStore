<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminEmail = 'admin@example.com';

        // Cari admin baik dengan admin@example.com atau legacy admin@example
        $admin = User::query()
            ->where('email', $adminEmail)
            ->orWhere('email', 'admin@example')
            ->first();

        if (! $admin) {
            User::create([
                'name'     => 'Admin',
                'email'    => $adminEmail,
                'password' => Hash::make('password123'),
                'is_admin' => true,
            ]);
        } else {
            $admin->update([
                'email'    => $adminEmail,
                'password' => Hash::make('password123'),
                'is_admin' => true,
            ]);
        }

        // Akun Pelanggan / User Biasa untuk testing belanja
        $customerEmail = 'user@example.com';
        $customer = User::query()->where('email', $customerEmail)->first();

        if (! $customer) {
            User::create([
                'name'     => 'Customer Test',
                'email'    => $customerEmail,
                'phone'    => '081234567890',
                'password' => Hash::make('password123'),
                'is_admin' => false,
            ]);
        } else {
            $customer->update([
                'password' => Hash::make('password123'),
                'phone'    => $customer->phone ?: '081234567890',
            ]);
        }
    }
}
