<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\UserAddress;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating companies with addresses...');

        // 1. 大企業（法人）を20社作成
        $this->command->info('Creating 20 large corporate companies...');
        $largeCompanies = Company::factory()
            ->count(20)
            ->corporate()
            ->active()
            ->create();

        foreach ($largeCompanies as $company) {
            // 本社住所（デフォルト）
            UserAddress::factory()
                ->forCompany($company)
                ->office()
                ->default()
                ->create();

            // 支店住所（1-3箇所）
            $branchCount = fake()->numberBetween(1, 3);
            for ($i = 0; $i < $branchCount; $i++) {
                UserAddress::factory()
                    ->forCompany($company)
                    ->branch()
                    ->create(['label' => '支店' . ($i + 1)]);
            }

            // 請求先住所（50%の確率）
            if (fake()->boolean(50)) {
                UserAddress::factory()
                    ->forCompany($company)
                    ->billing()
                    ->create();
            }

            // 配送先住所（30%の確率）
            if (fake()->boolean(30)) {
                UserAddress::factory()
                    ->forCompany($company)
                    ->shipping()
                    ->create();
            }
        }

        // 2. 中小企業（法人）を30社作成
        $this->command->info('Creating 30 small-medium corporate companies...');
        $mediumCompanies = Company::factory()
            ->count(30)
            ->corporate()
            ->active()
            ->state([
                'employee_count' => fake()->numberBetween(2, 50),
                'capital' => fake()->randomFloat(2, 1000000, 10000000),
            ])
            ->create();

        foreach ($mediumCompanies as $company) {
            // 本社住所（デフォルト）
            UserAddress::factory()
                ->forCompany($company)
                ->office()
                ->default()
                ->create();

            // 支店住所（0-1箇所）
            if (fake()->boolean(30)) {
                UserAddress::factory()
                    ->forCompany($company)
                    ->branch()
                    ->create(['label' => '支店']);
            }

            // 請求先住所（30%の確率）
            if (fake()->boolean(30)) {
                UserAddress::factory()
                    ->forCompany($company)
                    ->billing()
                    ->create();
            }
        }

        // 3. 個人事業主を25社作成
        $this->command->info('Creating 25 individual business entities...');
        $individuals = Company::factory()
            ->count(25)
            ->individual()
            ->active()
            ->create();

        foreach ($individuals as $individual) {
            // 事業所住所（デフォルト）
            UserAddress::factory()
                ->forCompany($individual)
                ->home()
                ->default()
                ->create(['label' => '事業所']);

            // 別の事業所住所（20%の確率）
            if (fake()->boolean(20)) {
                UserAddress::factory()
                    ->forCompany($individual)
                    ->office()
                    ->create(['label' => '作業場']);
            }
        }

        // 4. 非アクティブな企業を5社作成
        $this->command->info('Creating 5 inactive companies...');
        $inactiveCompanies = Company::factory()
            ->count(5)
            ->state(['status' => 'inactive'])
            ->create();

        foreach ($inactiveCompanies as $company) {
            UserAddress::factory()
                ->forCompany($company)
                ->office()
                ->default()
                ->state(['is_active' => false])
                ->create();
        }

        // 5. 有名企業風のサンプルデータ
        $this->command->info('Creating sample famous-style companies...');
        $sampleCompanies = [
            [
                'name' => 'サンプル商事',
                'company_type' => 'corporate',
                'legal_name' => 'サンプル商事株式会社',
                'industry' => '商社',
                'employee_count' => 500,
                'capital' => 50000000,
                'prefecture' => '東京都',
                'city' => '千代田区',
                'addresses' => [
                    ['type' => 'office', 'label' => '本社', 'default' => true],
                    ['type' => 'branch', 'label' => '大阪支店', 'default' => false],
                    ['type' => 'branch', 'label' => '名古屋支店', 'default' => false],
                ]
            ],
            [
                'name' => 'テックイノベーション',
                'company_type' => 'corporate',
                'legal_name' => 'テックイノベーション株式会社',
                'industry' => 'IT・ソフトウェア',
                'employee_count' => 150,
                'capital' => 20000000,
                'prefecture' => '東京都',
                'city' => '渋谷区',
                'addresses' => [
                    ['type' => 'office', 'label' => '本社', 'default' => true],
                    ['type' => 'office', 'label' => '開発センター', 'default' => false],
                ]
            ],
            [
                'name' => '田中工務店',
                'company_type' => 'individual',
                'industry' => '建設・不動産',
                'employee_count' => 1,
                'prefecture' => '埼玉県',
                'city' => 'さいたま市',
                'addresses' => [
                    ['type' => 'home', 'label' => '事業所', 'default' => true],
                ]
            ]
        ];

        foreach ($sampleCompanies as $companyData) {
            $addresses = $companyData['addresses'];
            unset($companyData['addresses']);

            $company = Company::factory()->create($companyData);

            foreach ($addresses as $addressData) {
                UserAddress::factory()
                    ->forCompany($company)
                    ->state([
                        'type' => $addressData['type'],
                        'label' => $addressData['label'],
                        'is_default' => $addressData['default'],
                    ])
                    ->create();
            }
        }

        $totalCompanies = Company::count();
        $totalAddresses = UserAddress::where('addressable_type', Company::class)->count();

        $this->command->info("✅ Companies created successfully!");
        $this->command->info("📊 Total companies: {$totalCompanies}");
        $this->command->info("📍 Total company addresses: {$totalAddresses}");
    }
}
