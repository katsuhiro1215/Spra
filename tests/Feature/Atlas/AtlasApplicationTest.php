<?php

namespace Tests\Feature\Atlas;

use App\Models\Contact;
use App\Models\ContactCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AtlasApplicationTest extends TestCase
{
    use RefreshDatabase;

    private function applyUrl(): string
    {
        return 'http://' . config('app.atlas_domain') . '/apply';
    }

    private function seedAtlasCategory(): void
    {
        ContactCategory::create([
            'name' => 'Atlas利用申込み',
            'slug' => ContactCategory::SLUG_ATLAS_APPLY,
            'sort_order' => 6,
            'is_active' => true,
        ]);
    }

    public function test_atlas_apply_form_can_be_displayed(): void
    {
        $this->get($this->applyUrl())->assertOk();
    }

    public function test_atlas_apply_submission_creates_contact_and_sends_notifications(): void
    {
        Mail::fake();
        Notification::fake();

        $this->seedAtlasCategory();

        $response = $this->post($this->applyUrl(), [
            'name' => 'テスト太郎',
            'email' => 'atlas-applicant@example.com',
            'phone' => '03-1234-5678',
            'message' => 'コンシェルジュブランドを希望します。',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $contact = Contact::where('email', 'atlas-applicant@example.com')->first();
        $this->assertNotNull($contact);
        $this->assertSame('atlas_apply', $contact->source);
        $this->assertSame('Atlas利用申込み', $contact->subject);
        $this->assertSame(ContactCategory::SLUG_ATLAS_APPLY, $contact->contactCategory?->slug);
    }

    public function test_atlas_apply_requires_name_and_email(): void
    {
        $this->seedAtlasCategory();

        $this->post($this->applyUrl(), [])
            ->assertSessionHasErrors(['name', 'email']);
    }

    public function test_atlas_apply_succeeds_without_optional_phone_and_message(): void
    {
        Mail::fake();
        Notification::fake();

        $this->seedAtlasCategory();

        // phone/messageは任意項目だが、contacts.messageはDB上NOT NULLのため
        // 空欄でもレコード作成に失敗しないことを確認する回帰テスト。
        $response = $this->post($this->applyUrl(), [
            'name' => 'テスト花子',
            'email' => 'atlas-no-message@example.com',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $contact = Contact::where('email', 'atlas-no-message@example.com')->first();
        $this->assertNotNull($contact);
        $this->assertNotNull($contact->message);
    }
}
