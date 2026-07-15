<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\FaqCategory;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faqsByCategorySlug = [
            'general' => [
                [
                    'question' => 'どのようなサービスを提供していますか?',
                    'answer' => 'Webサイト制作、システム開発、アプリ開発、ECサイト構築、ITコンサルティング、AI活用支援など、幅広いITソリューションを提供しています。お客様のビジネス課題に合わせた最適なソリューションをご提案いたします。',
                ],
                [
                    'question' => '小規模なプロジェクトでも依頼できますか?',
                    'answer' => 'はい、可能です。小規模なWebサイト制作から大規模システム開発まで、プロジェクトの規模を問わず対応しております。お気軽にご相談ください。',
                ],
                [
                    'question' => '対応可能な技術スタックを教えてください',
                    'answer' => 'フロントエンドはReact、Vue.js、Next.js、バックエンドはLaravel、Node.js、Python、データベースはMySQL、PostgreSQL、MongoDB、クラウドはAWS、GCP、Azureなど、最新の技術スタックに対応しています。',
                ],
            ],
            'pricing' => [
                [
                    'question' => '料金体系はどうなっていますか?',
                    'answer' => 'プロジェクトの規模や内容により異なります。まずは無料でお見積りをさせていただきますので、お気軽にお問い合わせください。概算については見積もりシミュレーターもご利用いただけます。',
                ],
                [
                    'question' => '支払い方法は何がありますか?',
                    'answer' => '銀行振込、クレジットカード決済に対応しております。分割払いのご相談も承りますので、お気軽にご相談ください。',
                ],
                [
                    'question' => '追加費用が発生することはありますか?',
                    'answer' => '契約時にお見積りした金額からの変更は、お客様のご要望による仕様変更があった場合のみです。その際も事前にお見積りをご提示し、ご承認いただいてから作業を進めますのでご安心ください。',
                ],
            ],
            'process' => [
                [
                    'question' => '開発にはどのくらいの期間がかかりますか?',
                    'answer' => 'プロジェクトの規模により異なります。小規模なWebサイトで1〜2ヶ月、中規模システムで3〜6ヶ月、大規模システムで6ヶ月以上が目安となります。詳細なスケジュールはヒアリング後にご提示いたします。',
                ],
                [
                    'question' => '急ぎの案件にも対応できますか?',
                    'answer' => '可能な限り対応いたします。ただし、品質を担保するため最低限必要な期間は確保させていただきます。まずはご希望の納期をお伝えください。',
                ],
                [
                    'question' => '納期の延長は可能ですか?',
                    'answer' => 'やむを得ない事情がある場合は、早めにご相談ください。プロジェクトの状況を確認し、可能な範囲で調整させていただきます。',
                ],
            ],
            'support' => [
                [
                    'question' => '納品後のサポートはありますか?',
                    'answer' => 'はい、納品後も保守サポートを提供しております。不具合対応、機能追加、運用サポートなど、お客様のご要望に応じたサポートプランをご用意しております。',
                ],
                [
                    'question' => '運用・保守の料金はいくらですか?',
                    'answer' => 'サイトの規模や必要なサポート内容により異なります。月額1万円〜のプランをご用意しておりますので、詳しくはお問い合わせください。',
                ],
                [
                    'question' => '緊急時の対応は可能ですか?',
                    'answer' => '保守契約をいただいているお客様には、緊急時の優先対応サービスをご提供しております。24時間365日の緊急対応プランもございます。',
                ],
            ],
            'contract' => [
                [
                    'question' => '契約前に相談することは可能ですか?',
                    'answer' => 'はい、初回のご相談は無料です。お気軽にお問い合わせフォームまたはお電話でご連絡ください。オンライン・対面どちらでも対応可能です。',
                ],
                [
                    'question' => '遠方でも依頼できますか?',
                    'answer' => 'はい、全国対応しております。オンラインでのお打ち合わせにも対応しておりますので、地域を問わずご依頼いただけます。',
                ],
                [
                    'question' => 'NDA(秘密保持契約)の締結は可能ですか?',
                    'answer' => 'はい、可能です。お客様の機密情報保護のため、プロジェクト開始前にNDAを締結させていただきます。',
                ],
            ],
        ];

        foreach ($faqsByCategorySlug as $categorySlug => $faqs) {
            $category = FaqCategory::where('slug', $categorySlug)->first();

            if (!$category) {
                continue;
            }

            foreach ($faqs as $index => $faq) {
                Faq::updateOrCreate(
                    [
                        'faq_category_id' => $category->id,
                        'question' => $faq['question'],
                    ],
                    [
                        'answer' => $faq['answer'],
                        'sort_order' => $index + 1,
                        'is_featured' => false,
                        'is_published' => true,
                    ]
                );
            }
        }
    }
}
