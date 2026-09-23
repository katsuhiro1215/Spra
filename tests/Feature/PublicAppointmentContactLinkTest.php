<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Appointment;
use App\Models\AppointmentSlot;
use App\Models\Contact;
use App\Models\ContactCategory;
use App\Models\Response;
use App\Models\ResponseTemplate;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Tests\TestCase;

class PublicAppointmentContactLinkTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        // /consultation は throttle:5,1 が付いており、同一プロセス内で複数テストを
        // 実行するとレート制限に引っかかるため無効化する
        $this->withoutMiddleware(ThrottleRequests::class);
    }

    private function createContact(): Contact
    {
        $category = ContactCategory::create([
            'name' => '一般的な問い合わせ',
            'slug' => 'general-'.uniqid(),
            'sort_order' => 1,
            'is_active' => true,
        ]);

        return Contact::create([
            'contact_category_id' => $category->id,
            'name' => 'ヒアリング誘導テスト太郎',
            'email' => 'hearing-link-test-'.uniqid().'@example.com',
            'message' => 'テストメッセージ',
            'status' => 'new',
            'source' => 'web',
        ]);
    }

    private function createSlot(): AppointmentSlot
    {
        return AppointmentSlot::create([
            'date' => now()->addDays(3)->format('Y-m-d'),
            'start_time' => '14:00:00',
            'end_time' => '14:30:00',
            'slot_type' => 'consultation',
        ]);
    }

    public function test_consultation_page_passes_a_valid_contact_id_as_a_prop(): void
    {
        $contact = $this->createContact();

        $response = $this->get(route('consultation', ['contact_id' => $contact->id]));

        $response->assertInertia(fn ($page) => $page
            ->component('Public/Consultation')
            ->where('contactId', $contact->id)
        );
    }

    public function test_consultation_page_drops_an_unknown_contact_id(): void
    {
        $response = $this->get(route('consultation', ['contact_id' => 'not-a-real-contact']));

        $response->assertInertia(fn ($page) => $page
            ->component('Public/Consultation')
            ->where('contactId', null)
        );
    }

    public function test_booking_with_a_contact_id_links_the_appointment_to_the_contact(): void
    {
        $contact = $this->createContact();
        $slot = $this->createSlot();

        $response = $this->post(route('consultation.store'), [
            'appointment_slot_id' => $slot->id,
            'guest_name' => 'ヒアリング誘導テスト太郎',
            'guest_email' => 'hearing-link-booking@example.com',
            'guest_phone' => '090-1234-5678',
            'contact_id' => $contact->id,
        ]);

        $response->assertSessionDoesntHaveErrors();

        $appointment = Appointment::where('guest_email', 'hearing-link-booking@example.com')->firstOrFail();
        $this->assertSame($contact->id, $appointment->contact_id);
        $this->assertTrue($appointment->contact->is($contact));
    }

    public function test_booking_without_a_contact_id_leaves_it_null(): void
    {
        $slot = $this->createSlot();

        $response = $this->post(route('consultation.store'), [
            'appointment_slot_id' => $slot->id,
            'guest_name' => '通常予約太郎',
            'guest_email' => 'no-contact-booking@example.com',
            'guest_phone' => '090-1234-5678',
        ]);

        $response->assertSessionDoesntHaveErrors();

        $appointment = Appointment::where('guest_email', 'no-contact-booking@example.com')->firstOrFail();
        $this->assertNull($appointment->contact_id);
    }

    public function test_booking_with_an_unknown_contact_id_is_rejected(): void
    {
        $slot = $this->createSlot();

        $response = $this->post(route('consultation.store'), [
            'appointment_slot_id' => $slot->id,
            'guest_name' => '不正contact_id太郎',
            'guest_email' => 'invalid-contact-booking@example.com',
            'guest_phone' => '090-1234-5678',
            'contact_id' => 'not-a-real-contact',
        ]);

        $response->assertSessionHasErrors('contact_id');
    }

    public function test_hearing_link_placeholder_resolves_to_the_consultation_url_for_the_contact(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $contact = $this->createContact();
        $template = ResponseTemplate::first() ?? ResponseTemplate::create([
            'name' => 'テスト用テンプレート',
            'category' => 'general',
            'subject' => 'テスト件名',
            'body' => 'テスト本文',
            'status' => 'active',
            'sort_order' => 1,
        ]);

        $response = Response::create([
            'contact_id' => $contact->id,
            'response_template_id' => $template->id,
            'admin_id' => $admin->id,
            'subject' => 'ご案内 {hearing_link}',
            'body' => 'ヒアリングはこちら: {hearing_link}',
            'recipient_email' => $contact->email,
            'recipient_name' => $contact->name,
            'status' => 'draft',
        ]);

        $rendered = $response->replacePlaceholders($response->body);

        $this->assertStringContainsString(
            route('consultation', ['contact_id' => $contact->id]),
            $rendered,
        );
    }
}
