<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Company;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating companies with addresses...');

        // =============================================
        // 1. 大企業（法人）を20社作成
        // =============================================
        $this->command->info('Creating 20 large corporate companies...');
        $largeCompanies = Company::factory()->count(20)->corporate()->active()->create();

        foreach ($largeCompanies as $company) {
            // 本社住所（デフォルト）
            Address::factory()->forCompany($company)->office()->default()->create();

            // 支店（1〜3箇所）
            $branchCount = fake()->numberBetween(1, 3);
            for ($i = 1; $i <= $branchCount; $i++) {
                Address::factory()->forCompany($company)->branch()->create(['label' => "支店{$i}"]);
            }

            // 請求先住所（50%）
            if (fake()->boolean(50)) {
                Address::factory()->forCompany($company)->billing()->create();
            }

            // 配送先住所（30%）
            if (fake()->boolean(30)) {
                Address::factory()->forCompany($company)->shipping()->create();
            }
        }

        // =============================================
        // 2. 中小企業（法人）を30社作成
        // =============================================
        $this->command->info('Creating 30 small-medium corporate companies...');
        $mediumCompanies = Company::factory()
            ->count(30)
            ->corporate()
            ->active()
            ->state([
                'employee_count' => fake()->numberBetween(2, 50),
                'capital'        => fake()->randomFloat(2, 1_000_000, 10_000_000),
            ])
            ->create();

        foreach ($mediumCompanies as $company) {
            // 本社住所（デフォルト）
            Address::factory()->forCompany($company)->office()->default()->create();

            // 支店（30%）
            if (fake()->boolean(30)) {
                Address::factory()->forCompany($company)->branch()->create(['label' => '支店']);
            }

            // 請求先（30%）
            if (fake()->boolean(30)) {
                Address::factory()->forCompany($company)->billing()->create();
            }
        }

        // =============================================
        // 3. 個人事業主を25社作成
        // =============================================
        $this->command->info('Creating 25 individual business entities...');
        $individuals = Company::factory()->count(25)->individual()->active()->create();

        foreach ($individuals as $individual) {
            // 事業所住所（デフォルト）
            Address::factory()->forCompany($individual)->home()->default()->create(['label' => '事業所']);

            // 別事業所（20%）
            if (fake()->boolean(20)) {
                Address::factory()->forCompany($individual)->office()->create(['label' => '作業場']);
            }
        }

        // =============================================
        // 4. 非アクティブな企業を5社作成
        // =============================================
        $this->command->info('Creating 5 inactive companies...');
        $inactiveCompanies = Company::factory()->count(5)->state(['status' => 'inactive'])->create();

        foreach ($inactiveCompanies as $company) {
            Address::factory()->forCompany($company)->office()->default()->inactive()->create();
        }

        // =============================================
        // 5. 固定サンプル企業
        // =============================================
        $this->command->info('Creating sample companies...');
        $sampleCompanies = [
            [
                'name'         => 'サンプル商事',
                'company_type' => 'corporate',
                'legal_name'   => 'サンプル商事株式会社',
                'industry'     => '商社',
                'employee_count' => 500,
                'capital'      => 50_000_000,
                'status'       => 'active',
                'addresses'    => [
                    ['type' => 'office', 'label' => '本社',   'is_default' => true],
                    ['type' => 'branch', 'label' => '大阪支店', 'is_default' => false],
                    ['type' => 'branch', 'label' => '名古屋支店', 'is_default' => false],
                ],
            ],
            [
                'name'         => 'テックイノベーション',
                'company_type' => 'corporate',
                'legal_name'   => 'テックイノベーション株式会社',
                'industry'     => 'IT・ソフトウェア',
                'employee_count' => 150,
                'capital'      => 20_000_000,
                'status'       => 'active',
                'addresses'    => [
                    ['type' => 'office', 'label' => '本社',     'is_default' => true],
                    ['type' => 'office', 'label' => '開発センター', 'is_default' => false],
                ],
            ],
            [
                'name'         => '田中工務店',
                'company_type' => 'individual',
                'industry'     => '建設・不動産',
                'employee_count' => 1,
                'status'       => 'active',
                'addresses'    => [
                    ['type' => 'home', 'label' => '事業所', 'is_default' => true],
                ],
            ],
        ];

        foreach ($sampleCompanies as $companyData) {
            $addressesData = $companyData['addresses'];
            unset($companyData['addresses']);

            $company = Company::factory()->create($companyData);

            foreach ($addressesData as $addressData) {
                Address::factory()->forCompany($company)->state($addressData)->create();
            }
        }

        $this->command->info('');
        $this->command->info('=== CompanySeeder Summary ===');
        $this->command->info('Total companies: ' . Company::count());
        $this->command->info('Company addresses: ' . Address::where('addressable_type', Company::class)->count());
    }
}
