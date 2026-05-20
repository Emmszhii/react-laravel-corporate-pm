<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Run permission seeder first, then sample data that uses those roles
        $this->call([
            PermissionSeeder::class,
            SampleDataSeeder::class,
        ]);
    }
}
