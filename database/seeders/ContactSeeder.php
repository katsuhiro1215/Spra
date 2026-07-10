<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\ContactCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ContactSeeder extends Seeder
{
    /**
     * お問い合わせデータのシード
     * 様々なパターンのお問い合わせを作成
     */
    public function run(): void
    {
        // ContactCategory を取得
        $generalCategory = ContactCategory::where('sort_order', 1)->first(); // 一般的な問い合わせ
        $technicalCategory = ContactCategory::where('sort_order', 3)->first(); // 技術的な問い合わせ
        $salesCategory = ContactCategory::where('sort_order', 4)->first(); // 営業関連の問い合わせ

        $contacts = [
            // 1. 新規Webサイト制作の相談（新規・Web流入）
            [
                'name' => '田中 太郎',
                'email' => 'tanaka@example-company.jp',
                'phone' => '03-1234-5678',
                'company' => '株式会社Example',
                'category_type' => 'general',
                'subject' => '新規Webサイト制作のご相談',
                'message' => "お世話になります。\n\n当社は創業5年目のIT企業です。この度、コーポレートサイトを新規で制作したいと考えております。\n\n【希望内容】\n- コーポレートサイト（10ページ程度）\n- レスポンシブ対応\n- CMSによる更新機能\n- 納期：3ヶ月以内\n\n予算感やスケジュール感について、一度お打ち合わせさせていただければと思います。\n\nよろしくお願いいたします。",
                'status' => 'new',
                'source' => 'web',
                'ip' => '192.168.1.100',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'referrer' => 'https://www.google.com/search?q=web制作+東京',
            ],

            // 2. 既存サイトのリニューアル（進行中・電話問い合わせ）
            [
                'name' => '佐藤 花子',
                'email' => 'sato@abc-corp.com',
                'phone' => '06-9876-5432',
                'company' => 'ABC株式会社',
                'category_type' => 'general',
                'subject' => '既存サイトのリニューアルについて',
                'message' => "先日お電話でお問い合わせさせていただきました佐藤です。\n\n現在運用中のコーポレートサイトが古くなってきたため、フルリニューアルを検討しております。\n\n【現状の課題】\n- デザインが古い\n- スマホ対応ができていない\n- 更新が困難（静的HTML）\n- SEO対策が不十分\n\n【希望】\n- モダンなデザイン\n- CMS導入\n- SEO対策\n- 多言語対応（日英）\n\n詳細をお打ち合わせさせてください。",
                'status' => 'in_progress',
                'source' => 'phone',
                'ip' => '203.0.113.25',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'replied_at' => now()->subDays(1),
                'admin_notes' => '電話で初回ヒアリング完了。次回：詳細ヒアリングのMTG設定予定',
            ],

            // 3. ECサイト構築（返信済み・SNS流入）
            [
                'name' => '鈴木 一郎',
                'email' => 'suzuki@fashion-store.jp',
                'phone' => '03-5555-1234',
                'company' => 'ファッションストア株式会社',
                'category_type' => 'general',
                'subject' => 'ECサイト構築のご相談',
                'message' => "インスタグラムの広告を見てご連絡しました。\n\nアパレルブランドを運営しており、オンラインショップを立ち上げたいと考えております。\n\n【要件】\n- 商品登録・在庫管理\n- 決済システム連携（クレジット・コンビニ払い等）\n- 会員管理機能\n- ポイントシステム\n- 予算：300〜500万円\n\n類似案件の実績があれば教えてください。",
                'status' => 'replied',
                'source' => 'sns',
                'ip' => '198.51.100.45',
                'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
                'referrer' => 'https://www.instagram.com/',
                'replied_at' => now()->subDays(2),
                'admin_notes' => '実績資料を送付済み。見積もり作成中',
            ],

            // 4. 保守・運用の相談（クローズ済み・紹介）
            [
                'name' => '高橋 美咲',
                'email' => 'takahashi@web-service.co.jp',
                'phone' => '090-1234-5678',
                'company' => 'Webサービス株式会社',
                'category_type' => 'general',
                'subject' => 'サイト保守・運用のご相談',
                'message' => "貴社のクライアントである○○社様からのご紹介でご連絡しております。\n\n現在、制作会社に依頼して作成したサイトの保守・運用を別の会社に依頼していますが、対応が遅く困っております。\n\n【希望サービス】\n- 定期的な更新作業\n- セキュリティ対策\n- サーバー監視\n- 緊急時の対応\n- 月額：5万円程度\n\n保守プランについて詳しくお聞かせください。",
                'status' => 'closed',
                'source' => 'referral',
                'ip' => '192.0.2.150',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                'replied_at' => now()->subDays(5),
                'admin_notes' => '契約締結。保守契約（ベーシックプラン）で合意',
            ],

            // 5. システム開発（新規・メール問い合わせ）
            [
                'name' => '伊藤 健太',
                'email' => 'ito@logistics-company.jp',
                'phone' => '03-7777-8888',
                'company' => '物流株式会社',
                'category_type' => 'general',
                'subject' => '業務管理システム開発のご相談',
                'message' => "お世話になります。\n\n当社では物流業務を行っており、現在Excelで管理している業務をシステム化したいと考えております。\n\n【システム化したい業務】\n- 配送管理\n- 在庫管理\n- 請求管理\n- スタッフ管理\n\n【希望】\n- Webベースのシステム\n- スマホ・タブレット対応\n- 複数拠点からアクセス可能\n\n大規模なシステムになるかと思いますが、段階的な開発も可能でしょうか？\n\nまずはご相談させてください。",
                'status' => 'new',
                'source' => 'email',
                'ip' => '203.0.113.100',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            ],

            // 6. 技術相談（進行中・Web流入）
            [
                'name' => '山田 浩二',
                'email' => 'yamada@tech-startup.io',
                'phone' => '080-9999-0000',
                'company' => 'テックスタートアップ株式会社',
                'category_type' => 'technical',
                'subject' => '技術スタックについてのご相談',
                'message' => "お世話になります。\n\nスタートアップ企業でCTOをしております。新規サービスの開発において、技術選定でアドバイスをいただきたくご連絡しました。\n\n【サービス概要】\n- マッチングプラットフォーム\n- 月間10万PV想定\n- リアルタイム通知機能\n- 決済機能\n\n【相談内容】\n- フレームワークの選定（Laravel vs Next.js等）\n- インフラ構成（AWS vs GCP）\n- 開発体制の構築\n\n技術顧問的な立場でのご協力も検討しております。\n\nオンラインでのMTGは可能でしょうか？",
                'status' => 'in_progress',
                'source' => 'web',
                'ip' => '198.51.100.200',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                'referrer' => 'https://www.google.com/search?q=laravel+開発会社',
                'admin_notes' => '初回MTG実施済み。技術提案書作成中',
            ],

            // 7. 採用に関する問い合わせ（新規・Web流入）
            [
                'name' => '小林 真由美',
                'email' => 'kobayashi.m@gmail.com',
                'phone' => '090-1111-2222',
                'company' => null,
                'category_type' => 'sales',
                'subject' => '採用について',
                'message' => "こんにちは。\n\n採用ページを拝見してご連絡しました。\n\nフロントエンドエンジニアとして3年の実務経験があります。React、Vue.js、TypeScriptを使った開発経験があり、次のキャリアを考えております。\n\n【スキル】\n- React.js / Next.js\n- Vue.js / Nuxt.js\n- TypeScript\n- UI/UXデザインの知識\n\n正社員での採用状況や、選考フローについて教えていただけますでしょうか？\n\nポートフォリオもございますので、ご興味があればお送りします。\n\nよろしくお願いいたします。",
                'status' => 'new',
                'source' => 'web',
                'ip' => '192.168.1.50',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                'referrer' => 'https://www.wantedly.com/',
            ],

            // 8. 一般的な問い合わせ（新規・Web流入）
            [
                'name' => '中村 一郎',
                'email' => 'nakamura@personal-site.com',
                'phone' => null,
                'company' => null,
                'category_type' => 'general',
                'subject' => '個人サイトの制作費用について',
                'message' => "初めまして。\n\n個人でブログサイトを運営したいと考えており、制作をお願いできないかと思いご連絡しました。\n\n【希望】\n- シンプルなブログサイト\n- 自分で記事を更新できる仕組み\n- 予算：10〜20万円程度\n\n個人での依頼でも対応いただけますでしょうか？\n\nお忙しいところ恐縮ですが、ご検討よろしくお願いいたします。",
                'status' => 'new',
                'source' => 'web',
                'ip' => '203.0.113.75',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'referrer' => 'https://www.google.com/search?q=ブログサイト+制作',
            ],

            // 9. 緊急の問い合わせ（新規・電話）
            [
                'name' => '森田 優子',
                'email' => 'morita@emergency-client.jp',
                'phone' => '03-9999-0000',
                'company' => '緊急対応株式会社',
                'category_type' => 'general',
                'subject' => '【緊急】サイトがダウンしています',
                'message' => "大変申し訳ございません、電話が繋がらなかったためこちらから連絡しています。\n\n現在運用中の当社Webサイトが突然アクセスできない状態になっています。\n\n【状況】\n- サイトURL: https://www.emergency-client.jp\n- エラーメッセージ: 503 Service Unavailable\n- 発生時刻: 本日午前10時頃\n- サーバー: AWS\n\n至急対応が必要です。\n可能な限り早くご連絡いただけますでしょうか。\n\n携帯: 090-8888-7777（森田）",
                'status' => 'new',
                'source' => 'phone',
                'ip' => '198.51.100.250',
                'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
            ],

            // 10. 見積もり依頼（新規・その他）
            [
                'name' => '加藤 誠',
                'email' => 'kato@estimate-request.co.jp',
                'phone' => '06-5555-6666',
                'company' => '見積依頼株式会社',
                'category_type' => 'general',
                'subject' => 'LP制作の見積もり依頼',
                'message' => "お世話になります。\n\n新サービスのランディングページ制作について、見積もりをいただきたくご連絡しました。\n\n【内容】\n- サービス紹介LP（1ページ）\n- デザイン制作込み\n- レスポンシブ対応\n- お問い合わせフォーム設置\n- 納期: 1ヶ月以内\n\n【参考サイト】\nhttps://example-lp.com/service\n\nこのようなイメージでお願いしたいと考えております。\n\nご多忙のところ恐れ入りますが、概算で結構ですので見積もりをいただけますでしょうか。\n\nよろしくお願いいたします。",
                'status' => 'new',
                'source' => 'other',
                'ip' => '192.0.2.200',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            ],
        ];

        foreach ($contacts as $contactData) {
            // category_type に基づいて contact_category_id を設定
            $categoryId = null;
            if (isset($contactData['category_type'])) {
                $type = $contactData['category_type'];
                unset($contactData['category_type']);

                if ($type === 'general') {
                    $categoryId = $generalCategory?->id;
                } elseif ($type === 'technical') {
                    $categoryId = $technicalCategory?->id;
                } elseif ($type === 'sales') {
                    $categoryId = $salesCategory?->id;
                }
            }

            $contactData['contact_category_id'] = $categoryId;
            Contact::create($contactData);
        }
    }
}
