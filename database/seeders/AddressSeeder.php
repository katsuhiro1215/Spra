<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use App\Models\User;
use App\Models\Company;
use App\Models\Address;

class AddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating addresses...');

        // =============================================
        // 1. Admin用Address作成（主要な管理者のみ）
        // =============================================
        $adminAddresses = [
            'info@smartsprouts.jp' => [
                [
                    'type' => 'home',
                    'label' => '自宅',
                    'postal_code' => '6308303',
                    'prefecture' => '奈良県',
                    'city' => '奈良市',
                    'district' => '南紀寺町',
                    'address_other' => '2丁目274-3 萠黄アパート103号',
                    'phone' => '090-9580-9257',
                    'is_default' => true,
                    'is_active' => true,
                ],
            ],
            'katsuhiro.k1215@gmail.com' => [
                [
                    'type' => 'home',
                    'label' => '自宅',
                    'postal_code' => '6308303',
                    'prefecture' => '奈良県',
                    'city' => '奈良市',
                    'district' => '南紀寺町',
                    'address_other' => '2丁目274-3 萠黄アパート103号',
                    'phone' => '090-9580-9257',
                    'is_default' => true,
                    'is_active' => true,
                ],
            ],
        ];

        foreach ($adminAddresses as $email => $addresses) {
            $admin = Admin::where('email', $email)->first();
            if ($admin) {
                foreach ($addresses as $addressData) {
                    $existingAddress = $admin->addresses()
                        ->where('type', $addressData['type'])
                        ->where('postal_code', $addressData['postal_code'])
                        ->first();

                    if (!$existingAddress) {
                        $admin->addresses()->create($addressData);
                    }
                }
            }
        }

        $this->command->info('Admin addresses created.');

        // // =============================================
        // // 2. User用Address作成（約60%のユーザーに1〜2件）
        // // =============================================
        // $users = User::all();
        // $addressCount = 0;

        // $prefectures = ['東京都', '神奈川県', '千葉県', '埼玉県', '大阪府', '愛知県', '福岡県', '北海道'];
        // $cities = ['渋谷区', '新宿区', '港区', '中央区', '横浜市', '川崎市', '大阪市', '名古屋市'];

        // foreach ($users->random((int)($users->count() * 0.6)) as $user) {
        //     // 1件目: home (デフォルト)
        //     $user->addresses()->create([
        //         'type' => 'home',
        //         'label' => '自宅',
        //         'postal_code' => fake()->postcode(),
        //         'prefecture' => fake()->randomElement($prefectures),
        //         'city' => fake()->randomElement($cities),
        //         'district' => fake()->streetName(),
        //         'address_other' => fake()->secondaryAddress(),
        //         'phone' => fake()->optional(0.7)->phoneNumber(),
        //         'is_default' => true,
        //         'is_active' => true,
        //     ]);
        //     $addressCount++;

        //     // 30%の確率で2件目を作成（shipping）
        //     if (fake()->boolean(30)) {
        //         $user->addresses()->create([
        //             'type' => 'shipping',
        //             'label' => '配送先',
        //             'postal_code' => fake()->postcode(),
        //             'prefecture' => fake()->randomElement($prefectures),
        //             'city' => fake()->randomElement($cities),
        //             'district' => fake()->streetName(),
        //             'address_other' => fake()->secondaryAddress(),
        //             'phone' => fake()->optional(0.7)->phoneNumber(),
        //             'is_default' => false,
        //             'is_active' => true,
        //         ]);
        //         $addressCount++;
        //     }
        // }

        // $this->command->info('User addresses created: ' . $addressCount);

        // // =============================================
        // // 3. Company用Address作成
        // // =============================================
        // $company = Company::first();
        // if ($company) {
        //     $companyAddresses = [
        //         [
        //             'type' => 'office',
        //             'label' => '本社',
        //             'postal_code' => '1500002',
        //             'prefecture' => '東京都',
        //             'city' => '渋谷区',
        //             'district' => '渋谷',
        //             'address_other' => '2-1-1 渋谷ビル5F',
        //             'phone' => '03-5678-1234',
        //             'contact_person' => '総務部',
        //             'is_default' => true,
        //             'is_active' => true,
        //         ],
        //         [
        //             'type' => 'billing',
        //             'label' => '請求先',
        //             'postal_code' => '1500002',
        //             'prefecture' => '東京都',
        //             'city' => '渋谷区',
        //             'district' => '渋谷',
        //             'address_other' => '2-1-1 渋谷ビル5F',
        //             'phone' => '03-5678-1234',
        //             'contact_person' => '経理部',
        //             'is_default' => false,
        //             'is_active' => true,
        //         ],
        //     ];

        //     foreach ($companyAddresses as $addressData) {
        //         $existingAddress = $company->addresses()
        //             ->where('type', $addressData['type'])
        //             ->where('postal_code', $addressData['postal_code'])
        //             ->first();

        //         if (!$existingAddress) {
        //             $company->addresses()->create($addressData);
        //         }
        //     }

        //     $this->command->info('Company addresses created.');
        // }

        $this->command->info('Total addresses: ' . Address::count());
    }
}
