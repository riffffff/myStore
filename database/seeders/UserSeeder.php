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
        if (User::where('email', 'admin@paitech.id')->doesntExist()) {
            User::create([
                'name'     => 'PaiTech Admin',
                'email'    => 'admin@paitech.id',
                'password' => Hash::make('password123'),
                'is_admin' => true,
            ]);
        } else {
            // Pastikan user admin yang sudah ada punya flag is_admin = true
            User::where('email', 'admin@paitech.id')
                ->update(['is_admin' => true]);
        }
        
        // Keep legacy admin for backward compatibility
        if (User::where('email', 'agusgerobakweb@gmail.com')->exists()) {
            User::where('email', 'agusgerobakweb@gmail.com')
                ->update([
                    'name' => 'PaiTech Admin (Legacy)',
                    'is_admin' => true
                ]);
        }
    }
}
