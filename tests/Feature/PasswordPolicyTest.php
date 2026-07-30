<?php

namespace Tests\Feature;

use App\Services\AdminService;
use App\Services\UserService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Tests\TestCase;

class PasswordPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_short_password_without_mixed_case_or_numbers_is_rejected(): void
    {
        $validator = Validator::make(
            ['password' => 'password', 'password_confirmation' => 'password'],
            ['password' => ['required', 'confirmed', Password::defaults()]],
        );

        $this->assertTrue($validator->fails());
    }

    public function test_password_without_numbers_is_rejected(): void
    {
        $validator = Validator::make(
            ['password' => 'PasswordOnly', 'password_confirmation' => 'PasswordOnly'],
            ['password' => ['required', 'confirmed', Password::defaults()]],
        );

        $this->assertTrue($validator->fails());
    }

    public function test_password_meeting_the_policy_is_accepted(): void
    {
        $validator = Validator::make(
            ['password' => 'StrongPassword123', 'password_confirmation' => 'StrongPassword123'],
            ['password' => ['required', 'confirmed', Password::defaults()]],
        );

        $this->assertFalse($validator->fails());
    }

    public function test_admin_service_generates_a_policy_compliant_password(): void
    {
        $service = app(AdminService::class);

        $result = $service->createAdmin([
            'email' => 'policy-admin@example.com',
            'role' => 'admin',
        ]);

        $validator = Validator::make(
            ['password' => $result['password']],
            ['password' => ['required', Password::defaults()]],
        );

        $this->assertFalse($validator->fails());
        $this->assertTrue(Hash::check($result['password'], $result['admin']->fresh()->password));
    }

    public function test_user_service_generates_a_policy_compliant_password(): void
    {
        $service = app(UserService::class);

        $result = $service->createUser([
            'email' => 'policy-user@example.com',
        ]);

        $validator = Validator::make(
            ['password' => $result['password']],
            ['password' => ['required', Password::defaults()]],
        );

        $this->assertFalse($validator->fails());
        $this->assertTrue(Hash::check($result['password'], $result['user']->fresh()->password));
    }
}
