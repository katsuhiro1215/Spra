<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('companies')->insert(
            [
                // 実際のデータ
                [
                    'id' => (string) Str::ulid(),
                    'media_id' => null,
                    'name' => 'サンサン農園',
                    'company_type' => 'corporate',
                    'legal_name' => 'サンサン農園株式会社',
                    'registration_number' => null,
                    'tax_number' => null,
                    'phone' => '090-3177-7743',
                    'fax' => null,
                    'email' => 's-kato@package-f.jp',
                    'website' => 'https://sunsunfarm-fukui.com',
                    'representative_name' => '加藤 修一',
                    'representative_title' => '代表取締役',
                    'representative_email' => 's-kato@package-f.jp',
                    'representative_phone' => '090-3177-7743',
                    'business_description' => '野菜の生産・販売を行う農園です。新鮮な野菜をお届けすることを目指しています。',
                    'industry' => null,
                    'employee_count' => 5,
                    'capital' => null,
                    'established_date' => null,
                    'status' => true,
                    'notes' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => (string) Str::ulid(),
                    'media_id' => null,
                    'name' => 'ピラティス整体・治療院WellSIA',
                    'company_type' => 'corporate',
                    'legal_name' => 'ピラティス整体・治療院WellSIA合同会社',
                    'registration_number' => null,
                    'tax_number' => null,
                    'phone' => '070-8482-5102',
                    'fax' => null,
                    'email' => 'wellsia.pi@gmail.com',
                    'website' => 'https://pilates-wellsia.com/',
                    'representative_name' => '柿野 良太',
                    'representative_title' => '代表',
                    'representative_email' => 'wellsia.pi@gmail.com',
                    'representative_phone' => '070-8482-5102',
                    'business_description' => 'ピラティス整体・治療院WellSIAは、ピラティスを取り入れた整体・治療を提供する治療院です。身体の不調や痛みを改善し、健康な生活をサポートします。',
                    'industry' => '美容・健康',
                    'employee_count' => 2,
                    'capital' => null,
                    'established_date' => '2023-03-14',
                    'status' => true,
                    'notes' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => (string) Str::ulid(),
                    'media_id' => null,
                    'name' => 'ケンコー社',
                    'company_type' => 'corporate',
                    'legal_name' => '株式会社ケンコー社',
                    'registration_number' => null,
                    'tax_number' => null,
                    'phone' => '06-6374-2788',
                    'fax' => '06-6374-2256',
                    'email' => '',
                    'website' => 'https://kenkosya.com',
                    'representative_name' => '中村 英史',
                    'representative_title' => '代表取締役',
                    'representative_email' => 'nakamura@kenkosya.com',
                    'representative_phone' => '090-3177-7743',
                    'business_description' => 'ケンコー社は、アウトドア用品の輸入・販売を行う企業です。 キャンプ用品や登山用品など、アウトドア活動に必要な製品を提供しています。',
                    'industry' => '小売・卸売',
                    'employee_count' => 20,
                    'capital' => 20000000,
                    'established_date' => '1979-08-01',
                    'status' => true,
                    'notes' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => (string) Str::ulid(),
                    'media_id' => null,
                    'name' => 'エフォート体操クラブ',
                    'company_type' => 'individual',
                    'legal_name' => 'エフォート体操クラブ',
                    'registration_number' => null,
                    'tax_number' => null,
                    'phone' => '06-4967-3161',
                    'fax' => null,
                    'email' => 'info@effortgym.jp',
                    'website' => 'https://effortgym.jp/',
                    'representative_name' => '藤岡 修',
                    'representative_title' => '代表',
                    'representative_email' => 'effortgc@gmail.com',
                    'representative_phone' => '06-4967-3161',
                    'business_description' => 'エフォート体操クラブは、体操教室を運営する個人事業主です。子どもから大人まで幅広い年齢層に体操指導を行っています。',
                    'industry' => 'スポーツ',
                    'employee_count' => 4,
                    'capital' => null,
                    'established_date' => '2023-10-01',
                    'status' => true,
                    'notes' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]
        );


        // 実際のデータの会社（ピラティス整体・治療院WellSIA）に、動作確認用の
        // ダミーUser・会社住所（is_default）を紐付けておく。見積〜契約〜請求の
        // 一連のテストや、Analytics（都道府県別契約分布）の動作確認にそのまま使える。
        $wellsia = Company::where('email', 'wellsia.pi@gmail.com')->first();

        if ($wellsia) {
            $wellsiaUser = User::updateOrCreate(
                ['email' => 'wellsia.pi@gmail.com'],
                ['password' => Hash::make('password'), 'status' => 'active', 'email_verified_at' => now()]
            );

            DB::table('company_user')->updateOrInsert(
                ['user_id' => $wellsiaUser->id, 'company_id' => $wellsia->id],
                [
                    'id' => (string) Str::ulid(),
                    'role' => 'owner',
                    'is_primary' => true,
                    'joined_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            if (!$wellsia->addresses()->where('type', 'office')->exists()) {
                Address::factory()->forCompany($wellsia)->office()->default()->create([
                    'label' => '本社',
                    'postal_code' => '899-5433',
                    'prefecture' => '鹿児島県',
                    'city' => '姶良市',
                    'district' => '平松',
                    'address_other' => '5359-2',
                    'phone' => '070-8482-5102',
                    'is_default' => true,
                ]);
            }
        }

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
