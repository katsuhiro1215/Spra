<?php

namespace Tests\Feature;

use App\Mail\ContactNotificationMail;
use App\Models\Contact;
use App\Models\ContactCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactNotificationMailTest extends TestCase
{
    use RefreshDatabase;

    public function test_notification_mail_renders_with_a_valid_admin_link(): void
    {
        $category = ContactCategory::create([
            'name' => '一般的な問い合わせ',
            'slug' => 'general',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $contact = Contact::create([
            'contact_category_id' => $category->id,
            'name' => 'テスト太郎',
            'email' => 'contact-mail-test@example.com',
            'subject' => 'テスト件名',
            'message' => 'テストメッセージ',
            'status' => 'new',
            'source' => 'public',
        ]);

        // 以前は存在しないルート名(admin.homepage.contacts.show)を参照しており、
        // render()時にRouteNotFoundExceptionが発生していた(回帰テスト)。
        $html = (new ContactNotificationMail($contact))->render();

        $this->assertStringContainsString(route('admin.contact.show', $contact->id), $html);
    }
}
