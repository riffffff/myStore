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
        $adminEmail = 'admin@example';
        $admin = User::query()->where('email', $adminEmail)->first();

        if (! $admin) {
            User::create([
                'name'     => 'Admin',
                'email'    => $adminEmail,
                'password' => Hash::make('password123'),
                'is_admin' => true,
            ]);
        } else {
            $admin->update(['is_admin' => true]);
        }
    }
}
