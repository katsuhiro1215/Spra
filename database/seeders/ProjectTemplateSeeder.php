<?php

namespace Database\Seeders;

use App\Models\ProjectTemplate;
use App\Models\ProjectTemplateMilestone;
use Illuminate\Database\Seeder;

class ProjectTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Webサイト制作テンプレート
        $websiteTemplate = ProjectTemplate::create([
            'name' => 'Webサイト制作',
            'description' => 'コーポレートサイト、LP、ECサイト等のWebサイト制作プロジェクト用テンプレート',
            'icon' => 'globe',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $websiteMilestones = [
            ['milestone_name' => '企画', 'description' => 'ビジネス要件確認、競合調査、企画書作成', 'order' => 1],
            ['milestone_name' => '要件定義', 'description' => '要件定義書作成、システム要件確認', 'order' => 2],
            ['milestone_name' => 'デザイン', 'description' => 'ワイヤーフレーム作成、デザインカンプ制作', 'order' => 3],
            ['milestone_name' => 'コーディング', 'description' => 'HTML/CSS/JavaScript実装', 'order' => 4],
            ['milestone_name' => 'CMS構築', 'description' => 'CMS構築、コンテンツ管理', 'order' => 5],
            ['milestone_name' => 'テスト', 'description' => 'ブラウザテスト、動作確認', 'order' => 6],
            ['milestone_name' => '公開', 'description' => 'サーバーアップロード、本番環境配置', 'order' => 7],
            ['milestone_name' => '納品', 'description' => 'クライアント納品、最終確認', 'order' => 8],
            ['milestone_name' => '保守開始', 'description' => '保守作業開始、運用サポート', 'order' => 9],
        ];

        foreach ($websiteMilestones as $milestone) {
            ProjectTemplateMilestone::create([
                'project_template_id' => $websiteTemplate->id,
                ...$milestone,
            ]);
        }

        // LP制作テンプレート
        $lpTemplate = ProjectTemplate::create([
            'name' => 'LP制作',
            'description' => 'ランディングページ制作プロジェクト用テンプレート',
            'icon' => 'globe',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        $lpMilestones = [
            ['milestone_name' => '要件確認', 'description' => '要件確認、仕様書作成', 'order' => 1],
            ['milestone_name' => 'デザイン', 'description' => 'ワイヤーフレーム作成、デザインカンプ制作', 'order' => 2],
            ['milestone_name' => 'コーディング', 'description' => 'HTML/CSS/JavaScript実装', 'order' => 3],
            ['milestone_name' => '計測設定', 'description' => '計測タグ設置、解析設定', 'order' => 4],
            ['milestone_name' => '公開', 'description' => 'サーバーアップロード、本番環境配置', 'order' => 5],
            ['milestone_name' => '納品', 'description' => 'クライアント納品、最終確認', 'order' => 6],
            ['milestone_name' => '保守開始', 'description' => '保守作業開始、運用サポート', 'order' => 7],
        ];

        foreach ($lpMilestones as $milestone) {
            ProjectTemplateMilestone::create([
                'project_template_id' => $lpTemplate->id,
                ...$milestone,
            ]);
        }

        // ECサイト制作テンプレート
        $ecTemplate = ProjectTemplate::create([
            'name' => 'ECサイト制作',
            'description' => 'ECサイト制作プロジェクト用テンプレート',
            'icon' => 'shopping-cart',
            'sort_order' => 3,
            'is_active' => true,
        ]);

        $ecMilestones = [
            ['milestone_name' => '企画', 'description' => '企画立案、要件定義', 'order' => 1],
            ['milestone_name' => '要件定義', 'description' => '要件定義書作成、仕様確認', 'order' => 2],
            ['milestone_name' => '基本設計', 'description' => '基本設計書作成', 'order' => 3],
            ['milestone_name' => '詳細設計', 'description' => '詳細設計書作成', 'order' => 4],
            ['milestone_name' => 'デザイン', 'description' => 'ワイヤーフレーム作成、デザインカンプ制作', 'order' => 5],
            ['milestone_name' => 'コーディング', 'description' => 'HTML/CSS/JavaScript実装', 'order' => 6],
            ['milestone_name' => '商品登録', 'description' => '商品情報登録、在庫管理設定', 'order' => 7],
            ['milestone_name' => 'EC構築', 'description' => 'ECサイト構築、機能実装', 'order' => 8],
            ['milestone_name' => '決済設定', 'description' => '決済システム設定', 'order' => 9],
            ['milestone_name' => 'テスト', 'description' => 'ユニットテスト、統合テスト、UAT', 'order' => 10],
            ['milestone_name' => '公開', 'description' => 'サーバーアップロード、本番環境配置', 'order' => 11],
            ['milestone_name' => '納品', 'description' => 'クライアント納品、最終確認', 'order' => 12],
            ['milestone_name' => '保守開始', 'description' => '保守作業開始、運用サポート', 'order' => 13],
        ];

        foreach ($ecMilestones as $milestone) {
            ProjectTemplateMilestone::create([
                'project_template_id' => $ecTemplate->id,
                ...$milestone,
            ]);
        }

        // CRMシステムテンプレート
        $crmTemplate = ProjectTemplate::create([
            'name' => 'CRMシステム',
            'description' => 'CRMシステム、予約システム、在庫管理、販売管理等のシステム開発用テンプレート',
            'icon' => 'cog',
            'sort_order' => 4,
            'is_active' => true,
        ]);

        $crmMilestones = [
            ['milestone_name' => '企画', 'description' => '要件定義書、システム設計書作成', 'order' => 1],
            ['milestone_name' => '要件定義', 'description' => '要件定義書、システム設計書作成', 'order' => 2],
            ['milestone_name' => '基本設計', 'description' => '基本設計書作成', 'order' => 3],
            ['milestone_name' => '詳細設計', 'description' => '詳細設計書作成', 'order' => 4],
            ['milestone_name' => 'デザイン', 'description' => 'UIデザイン、画面設計', 'order' => 5],
            ['milestone_name' => 'コーディング', 'description' => 'バックエンド、フロントエンド実装', 'order' => 6],
            ['milestone_name' => 'テスト', 'description' => 'ユニットテスト、統合テスト、UAT', 'order' => 7],
            ['milestone_name' => '公開', 'description' => 'サーバー配置、データ移行', 'order' => 8],
            ['milestone_name' => '納品', 'description' => 'クライアント納品、運用説明', 'order' => 9],
            ['milestone_name' => '保守開始', 'description' => '保守作業開始、運用サポート', 'order' => 10],
        ];

        foreach ($crmMilestones as $milestone) {
            ProjectTemplateMilestone::create([
                'project_template_id' => $crmTemplate->id,
                ...$milestone,
            ]);
        }

        // モバイルアプリ開発テンプレート
        $appTemplate = ProjectTemplate::create([
            'name' => 'モバイルアプリ開発',
            'description' => 'iOS/Android アプリ開発用テンプレート',
            'icon' => 'mobile',
            'sort_order' => 5,
            'is_active' => true,
        ]);

        $appMilestones = [
            ['milestone_name' => '企画', 'description' => '仕様書作成、要件確定', 'order' => 1],
            ['milestone_name' => '要件定義', 'description' => '仕様書作成、要件確定', 'order' => 2],
            ['milestone_name' => '基本設計', 'description' => '基本設計書作成', 'order' => 3],
            ['milestone_name' => '詳細設計', 'description' => '詳細設計書作成', 'order' => 4],
            ['milestone_name' => 'デザイン', 'description' => 'UIデザイン、プロトタイプ', 'order' => 5],
            ['milestone_name' => '開発', 'description' => 'アプリ開発、API実装', 'order' => 6],
            ['milestone_name' => 'テスト', 'description' => '各端末テスト、App Store/Play Store提出', 'order' => 7],
            ['milestone_name' => 'リリース', 'description' => 'App Store/Play Store リリース', 'order' => 8],
            ['milestone_name' => '納品', 'description' => 'クライアント納品、運用開始', 'order' => 9],
            ['milestone_name' => '保守開始', 'description' => '保守作業開始、運用サポート', 'order' => 10],
        ];

        foreach ($appMilestones as $milestone) {
            ProjectTemplateMilestone::create([
                'project_template_id' => $appTemplate->id,
                ...$milestone,
            ]);
        }
    }
}
