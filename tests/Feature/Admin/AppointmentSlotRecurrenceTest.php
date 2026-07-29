<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\AppointmentSlotRecurrence;
use Carbon\Carbon;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\ScheduleDefaultSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AppointmentSlotRecurrenceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        $this->seed(ScheduleDefaultSeeder::class);
    }

    public function test_admin_can_create_recurrence_and_slots_are_generated_for_matching_weekday(): void
    {
        $admin = Admin::factory()->create(['role' => 'owner', 'status' => 'active']);

        // 次の火曜日を起点にする（day_of_week=2）
        $startsOn = Carbon::now()->startOfDay()->next(Carbon::TUESDAY);
        $endsOn = $startsOn->copy()->addWeeks(2); // 3回分（起点含む）生成されるはず

        $this->actingAs($admin, 'admins')
            ->post(route('admin.appointment-slot-recurrences.store'), [
                'day_of_week' => 2,
                'start_time' => '10:00',
                'end_time' => '10:50',
                'slot_type' => 'meeting',
                'max_capacity' => 1,
                'starts_on' => $startsOn->format('Y-m-d'),
                'ends_on' => $endsOn->format('Y-m-d'),
            ])
            ->assertRedirect(route('admin.appointment-slot-recurrences.index'));

        $recurrence = AppointmentSlotRecurrence::firstOrFail();

        $this->assertSame(3, $recurrence->slots()->count());
        $this->assertTrue(
            $recurrence->slots()->pluck('date')->every(
                fn($date) => $date->dayOfWeek === Carbon::TUESDAY,
            ),
        );
    }

    public function test_paused_recurrence_does_not_generate_new_slots(): void
    {
        $admin = Admin::factory()->create(['role' => 'owner', 'status' => 'active']);
        $startsOn = Carbon::now()->startOfDay()->next(Carbon::TUESDAY);

        $recurrence = AppointmentSlotRecurrence::create([
            'day_of_week' => 2,
            'start_time' => '10:00',
            'end_time' => '10:50',
            'slot_type' => 'meeting',
            'max_capacity' => 1,
            'starts_on' => $startsOn->format('Y-m-d'),
            'ends_on' => $startsOn->copy()->addWeeks(4)->format('Y-m-d'),
            'status' => 'paused',
        ]);

        app(\App\Services\AppointmentSlotRecurrenceService::class)->generateSlots($recurrence);

        $this->assertSame(0, $recurrence->slots()->count());
    }

    public function test_admin_can_pause_and_resume_recurrence(): void
    {
        $admin = Admin::factory()->create(['role' => 'owner', 'status' => 'active']);
        $startsOn = Carbon::now()->startOfDay()->next(Carbon::TUESDAY);

        $recurrence = AppointmentSlotRecurrence::create([
            'day_of_week' => 2,
            'start_time' => '10:00',
            'end_time' => '10:50',
            'slot_type' => 'meeting',
            'max_capacity' => 1,
            'starts_on' => $startsOn->format('Y-m-d'),
            'ends_on' => $startsOn->copy()->addWeeks(4)->format('Y-m-d'),
            'status' => 'paused',
        ]);

        $this->actingAs($admin, 'admins')
            ->post(route('admin.appointment-slot-recurrences.resume', $recurrence))
            ->assertRedirect();

        $this->assertSame('active', $recurrence->fresh()->status);
        $this->assertGreaterThan(0, $recurrence->slots()->count());

        $this->actingAs($admin, 'admins')
            ->post(route('admin.appointment-slot-recurrences.pause', $recurrence))
            ->assertRedirect();

        $this->assertSame('paused', $recurrence->fresh()->status);
    }
}
