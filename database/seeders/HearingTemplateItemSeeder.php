<?php

namespace Database\Seeders;

use App\Models\HearingTemplateItem;
use Illuminate\Database\Seeder;

/**
 * ヒアリング質問項目マスタSeeder（小規模版）
 *
 * 質問項目はテンプレート管理画面を持たず、このSeederで固定投入する。
 * 内容を変更したい場合は本ファイルを編集し再実行する。
 */
class HearingTemplateItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            // サイト目的
            [
                'category' => 'サイト目的',
                'question' => 'サイトの種別',
                'type' => HearingTemplateItem::TYPE_SINGLE_CHOICE,
                'options' => ['コーポレートサイト', 'ランディングページ(LP)', 'ECサイト', '予約システム', 'その他'],
                'sort_order' => 1,
            ],
            [
                'category' => 'サイト目的',
                'question' => 'サイト開設の目的',
                'type' => HearingTemplateItem::TYPE_MULTI_CHOICE,
                'options' => ['集客・問い合わせ増加', '採用強化', '信頼性向上', '商品・サービス販売', '既存サイトのリニューアル', 'その他'],
                'sort_order' => 2,
            ],

            // デザイン
            [
                'category' => 'デザイン',
                'question' => '参考にしたいサイト（URL・複数可）',
                'type' => HearingTemplateItem::TYPE_TEXT,
                'options' => null,
                'sort_order' => 1,
            ],
            [
                'category' => 'デザイン',
                'question' => '希望するテイスト',
                'type' => HearingTemplateItem::TYPE_MULTI_CHOICE,
                'options' => ['シンプル・ミニマル', '高級感・上質', 'ポップ・親しみやすい', 'スタイリッシュ・先進的', 'ナチュラル・温かみ', 'その他'],
                'sort_order' => 2,
            ],

            // ページ構成
            [
                'category' => 'ページ構成',
                'question' => 'ページ数の目安',
                'type' => HearingTemplateItem::TYPE_SINGLE_CHOICE,
                'options' => ['〜5ページ', '6〜10ページ', '11〜20ページ', '要相談'],
                'sort_order' => 1,
            ],
            [
                'category' => 'ページ構成',
                'question' => '必要なページ',
                'type' => HearingTemplateItem::TYPE_MULTI_CHOICE,
                'options' => ['トップページ', '会社概要', 'サービス紹介', '料金・プラン', '実績・事例', 'ブログ・お知らせ', 'よくある質問', 'お問い合わせ', '採用情報', 'その他'],
                'sort_order' => 2,
            ],

            // 機能要件
            [
                'category' => '機能要件',
                'question' => '必須機能',
                'type' => HearingTemplateItem::TYPE_MULTI_CHOICE,
                'options' => ['お問い合わせフォーム', 'ブログ・お知らせ更新機能', '会員機能', 'ネット予約機能', '決済機能', '多言語対応', 'SNS連携', 'メールマガジン', 'その他'],
                'sort_order' => 1,
            ],
            [
                'category' => '機能要件',
                'question' => '更新頻度・自社更新の希望',
                'type' => HearingTemplateItem::TYPE_SINGLE_CHOICE,
                'options' => ['自社でこまめに更新したい', '月1回程度の更新で十分', '基本的に更新予定なし', '要相談'],
                'sort_order' => 2,
            ],

            // 参考情報
            [
                'category' => '参考情報',
                'question' => '既存資産（ロゴ・写真・原稿等）の有無',
                'type' => HearingTemplateItem::TYPE_MULTI_CHOICE,
                'options' => ['ロゴあり', '写真・画像あり', '原稿・文章あり', 'すべて新規作成が必要'],
                'sort_order' => 1,
            ],
            [
                'category' => '参考情報',
                'question' => '競合・同業他社サイト',
                'type' => HearingTemplateItem::TYPE_TEXT,
                'options' => null,
                'sort_order' => 2,
            ],

            // 予算感
            [
                'category' => '予算感',
                'question' => 'ご予算のレンジ',
                'type' => HearingTemplateItem::TYPE_SINGLE_CHOICE,
                'options' => ['〜30万円', '30〜50万円', '50〜100万円', '100万円〜', '未定・相談したい'],
                'sort_order' => 1,
            ],

            // 納期
            [
                'category' => '納期',
                'question' => '希望納期',
                'type' => HearingTemplateItem::TYPE_TEXT,
                'options' => null,
                'sort_order' => 1,
            ],

            // その他
            [
                'category' => 'その他',
                'question' => 'その他ご要望・懸念点',
                'type' => HearingTemplateItem::TYPE_TEXT,
                'options' => null,
                'sort_order' => 1,
            ],
        ];

        foreach ($items as $item) {
            HearingTemplateItem::updateOrCreate(
                ['category' => $item['category'], 'question' => $item['question']],
                [
                    'type' => $item['type'],
                    'options' => $item['options'],
                    'sort_order' => $item['sort_order'],
                    'is_active' => true,
                ]
            );
        }
    }
}
