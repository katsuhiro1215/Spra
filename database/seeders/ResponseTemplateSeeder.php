<?php

namespace Database\Seeders;

use App\Models\ResponseTemplate;
use Illuminate\Database\Seeder;

class ResponseTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'name' => 'お問い合わせ受付（一般）',
                'category' => 'general',
                'subject' => 'お問い合わせありがとうございます - {app_name}',
                'body' => "{contact_name} 様\n\nこの度は {app_name} にお問い合わせいただき、誠にありがとうございます。\n\nお問い合わせ内容を確認いたしました。\n\n【お問い合わせ内容】\n{contact_subject}\n\n担当者より改めてご連絡させていただきますので、\n今しばらくお待ちいただけますでしょうか。\n\nご不明な点がございましたら、お気軽にお問い合わせください。\n\n{admin_name}\n{app_name}",
                'placeholders' => 'contact_name, contact_email, contact_subject, admin_name, app_name',
                'status' => 'active',
                'sort_order' => 1,
            ],
            [
                'name' => '見積もり送付',
                'category' => 'estimate',
                'subject' => 'お見積もり送付のご案内 - {app_name}',
                'body' => "{contact_name} 様\n\nお世話になっております。{app_name} の {admin_name} です。\n\n先日お問い合わせいただきました件につきまして、\nお見積もりをご用意いたしましたのでご確認ください。\n\n【見積もり詳細】\n別途添付の見積書をご覧ください。\n\nご不明な点やご要望がございましたら、\nお気軽にお申し付けください。\n\nご検討のほど、よろしくお願いいたします。\n\n{admin_name}\n{app_name}",
                'placeholders' => 'contact_name, admin_name, app_name',
                'status' => 'active',
                'sort_order' => 2,
            ],
            [
                'name' => '技術的な質問への回答',
                'category' => 'technical',
                'subject' => '技術的なご質問への回答 - {app_name}',
                'body' => "{contact_name} 様\n\nお世話になっております。{app_name} の {admin_name} です。\n\nご質問いただきました技術的な内容につきまして、\n以下のとおり回答させていただきます。\n\n【回答内容】\n※ここに具体的な技術回答を記載してください\n\n引き続きご不明な点がございましたら、\nお気軽にお問い合わせください。\n\n{admin_name}\n{app_name}",
                'placeholders' => 'contact_name, admin_name, app_name',
                'status' => 'active',
                'sort_order' => 3,
            ],
            [
                'name' => 'サービス詳細のご案内',
                'category' => 'sales',
                'subject' => 'サービス詳細のご案内 - {app_name}',
                'body' => "{contact_name} 様\n\nお世話になっております。{app_name} の {admin_name} です。\n\nお問い合わせいただきましたサービスにつきまして、\n詳細をご案内させていただきます。\n\n【サービス概要】\n※ここにサービスの詳細説明を記載してください\n\n【料金プラン】\n※料金プランの詳細を記載してください\n\nご不明な点やご質問がございましたら、\nお気軽にお問い合わせください。\n\n無料相談も承っておりますので、\nぜひご活用ください。\n\n{admin_name}\n{app_name}",
                'placeholders' => 'contact_name, admin_name, app_name',
                'status' => 'active',
                'sort_order' => 4,
            ],
            [
                'name' => 'サポート対応完了',
                'category' => 'support',
                'subject' => 'サポート対応完了のご連絡 - {app_name}',
                'body' => "{contact_name} 様\n\nお世話になっております。{app_name} の {admin_name} です。\n\nお問い合わせいただいておりました件につきまして、\n対応が完了いたしましたのでご連絡いたします。\n\n【対応内容】\n※対応内容の詳細を記載してください\n\n引き続き何かございましたら、\nお気軽にお問い合わせください。\n\n今後とも {app_name} をよろしくお願いいたします。\n\n{admin_name}\n{app_name}",
                'placeholders' => 'contact_name, admin_name, app_name',
                'status' => 'active',
                'sort_order' => 5,
            ],
            [
                'name' => 'お断りのご連絡（丁寧）',
                'category' => 'other',
                'subject' => 'お問い合わせの件 - {app_name}',
                'body' => "{contact_name} 様\n\nお世話になっております。{app_name} の {admin_name} です。\n\nこの度はお問い合わせいただき、誠にありがとうございます。\n\n大変恐縮ではございますが、\n現在の状況では、ご要望にお応えすることが難しい状況でございます。\n\nせっかくお問い合わせいただきましたのに、\nご期待に添えず申し訳ございません。\n\n今後、状況が変わりましたら、\n改めてご連絡させていただきます。\n\n何卒ご理解のほど、よろしくお願いいたします。\n\n{admin_name}\n{app_name}",
                'placeholders' => 'contact_name, admin_name, app_name',
                'status' => 'active',
                'sort_order' => 6,
            ],
        ];

        foreach ($templates as $template) {
            ResponseTemplate::create($template);
        }
    }
}
