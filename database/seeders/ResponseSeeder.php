<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\ResponseTemplate;
use App\Models\Admin;
use App\Models\Response;
use Illuminate\Database\Seeder;

class ResponseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // テンプレートと管理者を取得
        $generalTemplate = ResponseTemplate::where('category', 'general')->first();
        $technicalTemplate = ResponseTemplate::where('category', 'technical')->first();
        $salesTemplate = ResponseTemplate::where('category', 'sales')->first();
        $admin = Admin::first();

        if (!$generalTemplate || !$technicalTemplate || !$salesTemplate || !$admin) {
            return; // 必要なデータがない場合はスキップ
        }

        // コンタクトを取得
        $contacts = Contact::limit(5)->get();

        $responses = [];
        foreach ($contacts as $index => $contact) {
            // テンプレートを選択（交互に異なるテンプレートを使用）
            if ($index % 3 === 0) {
                $template = $generalTemplate;
            } elseif ($index % 3 === 1) {
                $template = $technicalTemplate;
            } else {
                $template = $salesTemplate;
            }

            $responses[] = [
                'contact_id' => $contact->id,
                'response_template_id' => $template->id,
                'admin_id' => $admin->id,
                'subject' => str_replace('{app_name}', 'SmartSprouts', $template->subject),
                'body' => str_replace(
                    ['{contact_name}', '{admin_name}', '{app_name}'],
                    [$contact->name, $admin->name ?? 'SmartSprouts', 'SmartSprouts'],
                    $template->body
                ),
                'status' => Response::STATUS_DRAFT,
                'sent_at' => null,
                'recipient_email' => $contact->email,
                'recipient_name' => $contact->name,
                'send_error' => null,
                'created_by' => $admin->id,
            ];
        }

        foreach ($responses as $response) {
            Response::create($response);
        }
    }
}
