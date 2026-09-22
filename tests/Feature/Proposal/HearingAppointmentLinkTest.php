<?php

namespace Tests\Feature\Proposal;

use App\Models\Admin;
use App\Models\Appointment;
use App\Models\AppointmentSlot;
use App\Models\Contact;
use App\Models\ContactCategory;
use App\Models\Hearing;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HearingAppointmentLinkTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    private function createContact(): Contact
    {
        $category = ContactCategory::create([
            'name' => '見積もり依頼',
            'slug' => 'quote-request-' . uniqid(),
            'sort_order' => 1,
            'is_active' => true,
        ]);

        return Contact::create([
            'contact_category_id' => $category->id,
            'name' => 'ゲストテスト太郎',
            'email' => 'guest-appointment-' . uniqid() . '@example.com',
            'message' => 'テストメッセージ',
            'status' => 'new',
            'source' => 'web',
        ]);
    }

    /**
     * /consultation(Public\AppointmentController::store)が実際に作るのと同じ形
     * (AppointmentSlot + Appointment、user_id=null・guest_name/guest_emailあり)を
     * ここでは直接組み立てる。Public\AppointmentController自体のテストはスコープ外。
     */
    private function createGuestAppointment(): Appointment
    {
        $slot = AppointmentSlot::create([
            'date' => now()->addDays(3)->format('Y-m-d'),
            'start_time' => '14:00:00',
            'end_time' => '14:30:00',
            'slot_type' => 'consultation',
        ]);

        return Appointment::create([
            'appointment_slot_id' => $slot->id,
            'user_id' => null,
            'guest_name' => 'ゲストテスト太郎',
            'guest_email' => 'guest-appointment-test@example.com',
            'subject' => '無料相談(ヒアリング日程)',
            'location_type' => 'online',
            'status' => 'pending',
        ]);
    }

    public function test_hearing_can_be_linked_to_a_guest_appointment_without_a_user_account(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $contact = $this->createContact();
        $appointment = $this->createGuestAppointment();

        $hearing = Hearing::create([
            'contact_id' => $contact->id,
            'appointment_id' => $appointment->id,
            'title' => '無料相談予約に紐づくヒアリング',
            'created_by' => $admin->id,
        ]);

        $this->assertTrue($hearing->appointment->is($appointment));
        $this->assertNull($hearing->appointment->user_id);
        $this->assertSame('ゲストテスト太郎', $hearing->appointment->guest_name);
    }

    public function test_hearing_can_still_be_created_without_an_appointment(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $contact = $this->createContact();

        $hearing = Hearing::create([
            'contact_id' => $contact->id,
            'appointment_id' => null,
            'title' => '電話で日程調整したヒアリング',
            'created_by' => $admin->id,
        ]);

        $this->assertNull($hearing->appointment);
    }
}
