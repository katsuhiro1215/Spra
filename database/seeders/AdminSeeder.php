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
        $admins = [
            // Owner - 最高権限
            [
                'email' => 'kakoi10@smartsprouts.jp',
                'role' => 'owner',
                'status' => 'active',
            ],
            // Super Admin - システム管理者
            [
                'email' => 'kakoi100@smartsprouts.jp',
                'role' => 'super_admin',
                'status' => 'active',
            ],
            // Admin - 一般管理者（8名）
            [
                'email' => 'kakoi101@smartsprouts.jp',
                'role' => 'admin',
                'status' => 'active',
            ],
            [
                'email' => 'kakoi102@smartsprouts.jp',
                'role' => 'admin',
                'status' => 'active',
            ],
            [
                'email' => 'kakoi103@smartsprouts.jp',
                'role' => 'admin',
                'status' => 'active',
            ],
            [
                'email' => 'kakoi104@smartsprouts.jp',
                'role' => 'admin',
                'status' => 'inactive',
            ],
            [
                'email' => 'kakoi105@smartsprouts.jp',
                'role' => 'admin',
                'status' => 'suspended',
            ],
            [
                'email' => 'kakoi106@smartsprouts.jp',
                'role' => 'editor',
                'status' => 'active',
            ],
            [
                'email' => 'kakoi107@smartsprouts.jp',
                'role' => 'editor',
                'status' => 'active',
            ],
            [
                'email' => 'kakoi108@smartsprouts.jp',
                'role' => 'editor',
                'status' => 'active',
            ],
        ];

        foreach ($admins as $adminData) {
            Admin::updateOrCreate(
                ['email' => $adminData['email']],
                [
                    'email_verified_at' => now(),
                    'password' => Hash::make('password'),
                    'role' => $adminData['role'],
                    'status' => $adminData['status'],
                ]
            );
        }

        $this->command->info('管理者アカウントを作成しました: ' . count($admins) . '名');
    }
}
