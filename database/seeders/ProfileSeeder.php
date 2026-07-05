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
        // 1. Admin用Profile作成（10名）
        // =============================================
        $adminProfiles = [
            'katsuhiro.k1215@gmail.com' => [
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
            'kakoi100@smartsprouts.jp' => [
                'last_name' => '山田',
                'first_name' => '太郎',
                'last_name_kana' => 'ヤマダ',
                'first_name_kana' => 'タロウ',
                'display_name' => 'やまちゃん',
                'birth_date' => '1990-03-15',
                'gender' => 'male',
                'phone' => '03-2345-6789',
                'mobile' => '080-2345-6789',
                'emergency_contact_name' => '山田 花子',
                'emergency_contact_phone' => '080-8765-4321',
                'bio' => 'スーパー管理者として、運用全般を担当しています。',
            ],
            'kakoi101@smartsprouts.jp' => [
                'last_name' => '佐藤',
                'first_name' => '次郎',
                'last_name_kana' => 'サトウ',
                'first_name_kana' => 'ジロウ',
                'display_name' => 'さとじろ',
                'birth_date' => '1988-07-20',
                'gender' => 'male',
                'phone' => '03-3456-7890',
                'mobile' => '090-3456-7890',
                'bio' => '管理者としてシステム保守を担当。',
            ],
            'kakoi102@smartsprouts.jp' => [
                'last_name' => '鈴木',
                'first_name' => '美咲',
                'last_name_kana' => 'スズキ',
                'first_name_kana' => 'ミサキ',
                'display_name' => 'みーちゃん',
                'birth_date' => '1992-11-30',
                'gender' => 'female',
                'phone' => '03-4567-8901',
                'mobile' => '080-4567-8901',
                'bio' => 'コンテンツ管理を担当しています。',
            ],
            'kakoi103@smartsprouts.jp' => [
                'last_name' => '田中',
                'first_name' => '健一',
                'last_name_kana' => 'タナカ',
                'first_name_kana' => 'ケンイチ',
                'display_name' => 'けんちゃん',
                'birth_date' => '1987-09-05',
                'gender' => 'male',
                'phone' => '03-5678-9012',
                'mobile' => '090-5678-9012',
                'bio' => '営業とサポートを兼任しています。',
            ],
            'kakoi104@smartsprouts.jp' => [
                'last_name' => '高橋',
                'first_name' => '愛',
                'last_name_kana' => 'タカハシ',
                'first_name_kana' => 'アイ',
                'display_name' => 'あいちゃん',
                'birth_date' => '1995-02-14',
                'gender' => 'female',
                'phone' => '03-6789-0123',
                'mobile' => '080-6789-0123',
                'bio' => 'デザイン担当です。',
            ],
            'kakoi105@smartsprouts.jp' => [
                'last_name' => '伊藤',
                'first_name' => '博',
                'last_name_kana' => 'イトウ',
                'first_name_kana' => 'ヒロシ',
                'display_name' => 'ひろくん',
                'birth_date' => '1989-06-25',
                'gender' => 'male',
                'phone' => '03-7890-1234',
                'mobile' => '090-7890-1234',
                'bio' => '開発チームリーダー。',
            ],
            'kakoi106@smartsprouts.jp' => [
                'last_name' => '中村',
                'first_name' => '麻衣',
                'last_name_kana' => 'ナカムラ',
                'first_name_kana' => 'マイ',
                'display_name' => 'まいちゃん',
                'birth_date' => '1994-03-18',
                'gender' => 'female',
                'phone' => '03-8901-2345',
                'mobile' => '080-8901-2345',
                'bio' => 'エディターとしてコンテンツ編集を担当。',
            ],
            'kakoi107@smartsprouts.jp' => [
                'last_name' => '小林',
                'first_name' => '大輔',
                'last_name_kana' => 'コバヤシ',
                'first_name_kana' => 'ダイスケ',
                'display_name' => 'だいちゃん',
                'birth_date' => '1991-12-08',
                'gender' => 'male',
                'phone' => '03-9012-3456',
                'mobile' => '090-9012-3456',
                'bio' => 'エディターとしてブログ記事を執筆。',
            ],
            'kakoi108@smartsprouts.jp' => [
                'last_name' => '加藤',
                'first_name' => '優子',
                'last_name_kana' => 'カトウ',
                'first_name_kana' => 'ユウコ',
                'display_name' => 'ゆうちゃん',
                'birth_date' => '1993-05-22',
                'gender' => 'female',
                'phone' => '03-0123-4567',
                'mobile' => '080-0123-4567',
                'bio' => 'エディターとしてメディア管理を担当。',
            ],
        ];

        foreach ($adminProfiles as $email => $profileData) {
            $admin = Admin::where('email', $email)->first();
            if ($admin && !$admin->profile) {
                $admin->profile()->create($profileData);
            }
        }

        $this->command->info('Admin profiles created: ' . count($adminProfiles));

        // =============================================
        // 2. User用Profile作成（100名）
        // =============================================
        $users = User::all();
        $profileCount = 0;

        foreach ($users as $user) {
            if (!$user->profile) {
                $user->profile()->create([
                    'last_name' => fake('ja_JP')->lastName(),
                    'first_name' => fake('ja_JP')->firstName(),
                    'last_name_kana' => fake('ja_JP')->lastKanaName(),
                    'first_name_kana' => fake('ja_JP')->firstKanaName(),
                    'display_name' => fake()->optional(0.5)->userName(),
                    'birth_date' => fake()->optional(0.7)->dateTimeBetween('-60 years', '-18 years'),
                    'gender' => fake()->optional(0.8)->randomElement(['male', 'female', 'other', 'prefer_not_to_say']),
                    'phone' => fake()->optional(0.6)->phoneNumber(),
                    'mobile' => fake()->optional(0.9)->phoneNumber(),
                    'emergency_contact_name' => fake()->optional(0.3)->name(),
                    'emergency_contact_phone' => fake()->optional(0.3)->phoneNumber(),
                    'bio' => fake()->optional(0.3)->realText(200),
                ]);
                $profileCount++;
            }
        }

        $this->command->info('User profiles created: ' . $profileCount);
        $this->command->info('Total profiles: ' . Profile::count());
    }
}
