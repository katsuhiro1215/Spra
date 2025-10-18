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
        // Owner - 最高権限（kakoi10）
        Admin::updateOrCreate(
            ['email' => 'kakoi10@smartsprouts.jp'],
            [
                'name' => 'Owner - Katsuhiro Kakoi',
                'email' => 'kakoi10@smartsprouts.jp',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Super Admin - システム管理者（kakoi100）
        Admin::updateOrCreate(
            ['email' => 'kakoi100@smartsprouts.jp'],
            [
                'name' => 'Super Admin - Katsuhiro Admin',
                'email' => 'kakoi100@smartsprouts.jp',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Admin - 一般管理者（kakoi101）
        Admin::updateOrCreate(
            ['email' => 'kakoi101@smartsprouts.jp'],
            [
                'name' => 'Admin - システム管理',
                'email' => 'kakoi101@smartsprouts.jp',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Service Manager - サービス管理者（kakoi102）
        Admin::updateOrCreate(
            ['email' => 'kakoi102@smartsprouts.jp'],
            [
                'name' => 'Service Manager - サービス管理',
                'email' => 'kakoi102@smartsprouts.jp',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Content Manager - コンテンツ管理者（kakoi103）
        Admin::updateOrCreate(
            ['email' => 'kakoi103@smartsprouts.jp'],
            [
                'name' => 'Content Manager - コンテンツ管理',
                'email' => 'kakoi103@smartsprouts.jp',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Sales Manager - 営業管理者（kakoi104）
        Admin::updateOrCreate(
            ['email' => 'kakoi104@smartsprouts.jp'],
            [
                'name' => 'Sales Manager - 営業管理',
                'email' => 'kakoi104@smartsprouts.jp',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Customer Support - カスタマーサポート（kakoi105）
        Admin::updateOrCreate(
            ['email' => 'kakoi105@smartsprouts.jp'],
            [
                'name' => 'Customer Support - サポート',
                'email' => 'kakoi105@smartsprouts.jp',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Editor - 編集者（kakoi106）
        Admin::updateOrCreate(
            ['email' => 'kakoi106@smartsprouts.jp'],
            [
                'name' => 'Editor - 編集者',
                'email' => 'kakoi106@smartsprouts.jp',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Operator - オペレーター（kakoi107）
        Admin::updateOrCreate(
            ['email' => 'kakoi107@smartsprouts.jp'],
            [
                'name' => 'Operator - オペレーター',
                'email' => 'kakoi107@smartsprouts.jp',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Viewer - 閲覧者（kakoi108）
        Admin::updateOrCreate(
            ['email' => 'kakoi108@smartsprouts.jp'],
            [
                'name' => 'Viewer - 閲覧者',
                'email' => 'kakoi108@smartsprouts.jp',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('10種類の管理者アカウントを作成しました:');
        $this->command->info('Owner: kakoi10@smartsprouts.jp');
        $this->command->info('Super Admin: kakoi100@smartsprouts.jp');
        $this->command->info('Admin: kakoi101@smartsprouts.jp');
        $this->command->info('Service Manager: kakoi102@smartsprouts.jp');
        $this->command->info('Content Manager: kakoi103@smartsprouts.jp');
        $this->command->info('Sales Manager: kakoi104@smartsprouts.jp');
        $this->command->info('Customer Support: kakoi105@smartsprouts.jp');
        $this->command->info('Editor: kakoi106@smartsprouts.jp');
        $this->command->info('Operator: kakoi107@smartsprouts.jp');
        $this->command->info('Viewer: kakoi108@smartsprouts.jp');
        $this->command->info('すべてのパスワード: password');
    }
}
