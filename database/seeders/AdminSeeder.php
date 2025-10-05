<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::updateOrCreate(
            ['email' => 'admin@spra.co.jp'],
            [
                'name' => 'System Administrator',
                'email' => 'admin@spra.co.jp',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        Admin::updateOrCreate(
            ['email' => 'editor@spra.co.jp'],
            [
                'name' => 'Content Editor',
                'email' => 'editor@spra.co.jp',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
    }
}
