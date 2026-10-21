<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ShopSettingSeeder::class,
            ProductSeeder::class,
            ArticleSeeder::class,
            ReviewSeeder::class,
        ]);
    }
}
