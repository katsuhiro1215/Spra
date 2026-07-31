<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use App\Models\User;
use App\Models\Profile;

class ProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating profiles...');

        // =============================================
        // 1. Admin用Profile作成（5名）
        // =============================================
        $adminProfiles = [
            'info@smartsprouts.jp' => [
                'last_name' => '栫',
                'first_name' => '勝宏',
                'last_name_kana' => 'カコイ',
                'first_name_kana' => 'カツヒロ',
                'display_name' => 'かつコーチ',
                'birth_date' => '1981-12-15',
                'gender' => 'male',
                'phone' => '090-9580-9257',
                'mobile' => '090-9580-9257',
                'emergency_contact_name' => '栫 廣美',
                'emergency_contact_phone' => '090-9876-5432',
                'bio' => 'SmartSproutsのオーナー。全般を統括しています。',
            ],
            'katsuhiro.k1215@gmail.com' => [
                'last_name' => '栫',
                'first_name' => '勝宏',
                'last_name_kana' => 'カコイ',
                'first_name_kana' => 'カツヒロ',
                'display_name' => 'かつコーチ',
                'birth_date' => '1990-03-15',
                'gender' => 'male',
                'phone' => '03-2345-6789',
                'mobile' => '080-2345-6789',
                'emergency_contact_name' => '栫 静枝',
                'emergency_contact_phone' => null,
                'bio' => 'スーパー管理者として、運用全般を担当しています。',
            ],
        ];

        foreach ($adminProfiles as $email => $profileData) {
            $admin = Admin::where('email', $email)->first();
            if ($admin && !$admin->profile) {
                $admin->profile()->create($profileData);
            }
        }

        // $this->command->info('Admin profiles created: ' . count($adminProfiles));

        // // =============================================
        // // 2. User用Profile作成（100名）
        // // =============================================
        // $users = User::all();
        // $profileCount = 0;

        // foreach ($users as $user) {
        //     if (!$user->profile) {
        //         $user->profile()->create([
        //             'last_name' => fake('ja_JP')->lastName(),
        //             'first_name' => fake('ja_JP')->firstName(),
        //             'last_name_kana' => fake('ja_JP')->lastKanaName(),
        //             'first_name_kana' => fake('ja_JP')->firstKanaName(),
        //             'display_name' => fake()->optional(0.5)->userName(),
        //             'birth_date' => fake()->optional(0.7)->dateTimeBetween('-60 years', '-18 years'),
        //             'gender' => fake()->optional(0.8)->randomElement(['male', 'female', 'other', 'prefer_not_to_say']),
        //             'phone' => fake()->optional(0.6)->phoneNumber(),
        //             'mobile' => fake()->optional(0.9)->phoneNumber(),
        //             'emergency_contact_name' => fake()->optional(0.3)->name(),
        //             'emergency_contact_phone' => fake()->optional(0.3)->phoneNumber(),
        //             'bio' => fake()->optional(0.3)->realText(200),
        //         ]);
        //         $profileCount++;
        //     }
        // }

        // $this->command->info('User profiles created: ' . $profileCount);
        $this->command->info('Total profiles: ' . Profile::count());
    }
}
