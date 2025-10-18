<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Company;
use App\Models\UserAddress;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating users with addresses and company relationships...');

        // 1. 管理者ユーザー（既存のものがあれば更新、なければ作成）
        $this->command->info('Creating admin users...');
        $admin = User::where('email', 'admin@example.com')->first();
        if (!$admin) {
            $admin = User::factory()->create([
                'name' => '管理者',
                'email' => 'admin@example.com',
                'email_verified_at' => now(),
            ]);

            UserAddress::factory()
                ->forUser($admin)
                ->home()
                ->default()
                ->create(['label' => '自宅']);
        }

        // 2. テストユーザー（既存のものがあれば更新、なければ作成）
        $testUser = User::where('email', 'test@example.com')->first();
        if (!$testUser) {
            $testUser = User::factory()->create([
                'name' => 'テストユーザー',
                'email' => 'test@example.com',
                'email_verified_at' => now(),
            ]);

            UserAddress::factory()
                ->forUser($testUser)
                ->home()
                ->default()
                ->create(['label' => '自宅']);

            UserAddress::factory()
                ->forUser($testUser)
                ->office()
                ->create(['label' => '勤務先']);
        }

        // 3. 企業に所属するユーザー（会社員）
        $this->command->info('Creating company employees...');
        $companies = Company::where('company_type', 'corporate')->take(10)->get();

        foreach ($companies as $company) {
            // 各企業に2-5人の社員を作成
            $employeeCount = fake()->numberBetween(2, 5);

            for ($i = 0; $i < $employeeCount; $i++) {
                $employee = User::factory()->create([
                    'company_id' => $company->id,
                    'department' => fake()->randomElement(['営業部', '技術部', '管理部', '総務部', '経理部']),
                    'position' => fake()->randomElement(['部長', '課長', '主任', '一般', 'アルバイト']),
                ]);

                // 自宅住所（デフォルト）
                UserAddress::factory()
                    ->forUser($employee)
                    ->home()
                    ->default()
                    ->create(['label' => '自宅']);

                // 勤務先住所（会社住所を参照）
                UserAddress::factory()
                    ->forUser($employee)
                    ->office()
                    ->create([
                        'label' => '勤務先',
                        'postal_code' => $company->postal_code,
                        'prefecture' => $company->prefecture,
                        'city' => $company->city,
                        'district' => $company->district,
                        'address_other' => $company->address_other,
                    ]);

                // 配送先住所（30%の確率）
                if (fake()->boolean(30)) {
                    UserAddress::factory()
                        ->forUser($employee)
                        ->shipping()
                        ->create(['label' => '配送先']);
                }
            }
        }

        // 4. 個人事業主のユーザー
        $this->command->info('Creating individual business users...');
        $individualCompanies = Company::where('company_type', 'individual')->take(15)->get();

        foreach ($individualCompanies as $company) {
            $businessOwner = User::factory()->create([
                'company_id' => $company->id,
                'department' => null,
                'position' => '代表',
                'name' => $company->representative_name ?? fake()->name,
            ]);

            // 事業所住所（デフォルト、会社住所と同じ）
            UserAddress::factory()
                ->forUser($businessOwner)
                ->home()
                ->default()
                ->create([
                    'label' => '事業所兼自宅',
                    'postal_code' => $company->postal_code,
                    'prefecture' => $company->prefecture,
                    'city' => $company->city,
                    'district' => $company->district,
                    'address_other' => $company->address_other,
                ]);

            // 別の作業場（20%の確率）
            if (fake()->boolean(20)) {
                UserAddress::factory()
                    ->forUser($businessOwner)
                    ->office()
                    ->create(['label' => '作業場']);
            }
        }

        // 5. 一般ユーザー（企業に所属しない）
        $this->command->info('Creating general users...');
        $generalUsers = User::factory()->count(30)->create();

        foreach ($generalUsers as $user) {
            // 自宅住所（デフォルト）
            UserAddress::factory()
                ->forUser($user)
                ->home()
                ->default()
                ->create(['label' => '自宅']);

            // 勤務先住所（70%の確率）
            if (fake()->boolean(70)) {
                UserAddress::factory()
                    ->forUser($user)
                    ->office()
                    ->create(['label' => '勤務先']);
            }

            // 配送先住所（40%の確率）
            if (fake()->boolean(40)) {
                UserAddress::factory()
                    ->forUser($user)
                    ->shipping()
                    ->create(['label' => '配送先']);
            }

            // 請求先住所（20%の確率）
            if (fake()->boolean(20)) {
                UserAddress::factory()
                    ->forUser($user)
                    ->billing()
                    ->create(['label' => '請求先']);
            }
        }

        // 6. 複数住所を持つユーザー（VIP顧客想定）
        $this->command->info('Creating VIP users with multiple addresses...');
        $vipUsers = User::factory()->count(5)->create([
            'email_verified_at' => now(),
        ]);

        foreach ($vipUsers as $user) {
            // メイン住所
            UserAddress::factory()
                ->forUser($user)
                ->home()
                ->default()
                ->create(['label' => 'メイン住所']);

            // 別荘
            UserAddress::factory()
                ->forUser($user)
                ->home()
                ->create(['label' => '別荘']);

            // 実家
            UserAddress::factory()
                ->forUser($user)
                ->home()
                ->create(['label' => '実家']);

            // オフィス
            UserAddress::factory()
                ->forUser($user)
                ->office()
                ->create(['label' => 'オフィス']);

            // 配送先（複数）
            for ($i = 1; $i <= 2; $i++) {
                UserAddress::factory()
                    ->forUser($user)
                    ->shipping()
                    ->create(['label' => "配送先{$i}"]);
            }
        }

        $totalUsers = User::count();
        $totalUserAddresses = UserAddress::where('addressable_type', User::class)->count();

        $this->command->info("✅ Users created successfully!");
        $this->command->info("👥 Total users: {$totalUsers}");
        $this->command->info("📍 Total user addresses: {$totalUserAddresses}");
    }
}
