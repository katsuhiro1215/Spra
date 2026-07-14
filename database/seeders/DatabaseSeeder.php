<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // ロール・権限（Adminのroleカラム同期のためAdminSeederより先に実行）
            RolePermissionSeeder::class,

            // 管理者（認証確認用）
            AdminSeeder::class,

            // 会社（ユーザーより先に作成 → company_user で参照される）
            CompanySeeder::class,

            // ユーザー（会社への紐付け・住所含む）
            UserSeeder::class,

            // プロフィール（Admin, User統合）
            ProfileSeeder::class,

            // 住所（Admin, User, Company統合）
            AddressSeeder::class,

            // メディア
            MediaSeeder::class,

            // アクセス解析（デモ用のpageviewイベント）
            AnalyticsEventSeeder::class,

            // お問い合わせ
            ContactCategorySeeder::class,
            ContactSeeder::class,
            ResponseTemplateSeeder::class,
            ResponseSeeder::class,

            // サービス関連
            ServiceCategorySeeder::class,
            ServiceSeeder::class,
            ServiceItemSeeder::class,
            ServicePlanSeeder::class,
            ServicePlanItemSeeder::class,

            // 使用技術・ギャラリー画像・実績（サービス表示強化）
            TechnologySeeder::class,
            ServiceMediaSeeder::class,
            PortfolioSeeder::class,

            // 祝日・面談枠
            ScheduleDefaultSeeder::class,
            ScheduleExceptionSeeder::class,
            HolidaySeeder::class,

            // 文書（規約・ヘルプ・APIドキュメント等）
            DocumentCategorySeeder::class,
            DocumentSeeder::class,

            // 見積（Quote）
            QuoteSeeder::class,

            // 契約（Contract）
            ContractSeeder::class,

            // プロジェクト関連
            ProjectTemplateSeeder::class,
            ProjectSeeder::class,

            // 請求・入金・領収書
            InvoiceSeeder::class,
            PaymentSeeder::class,
            ReceiptSeeder::class,

            // 予約（面談）
            AppointmentSeeder::class,
        ]);
    }
}
