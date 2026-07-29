<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Company;
use App\Models\Quote;
use App\Models\QuoteItem;
use App\Models\QuoteResponse;
use App\Models\QuoteVersion;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Tests\TestCase;

class OnboardingApprovalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        Mail::fake();
    }

    /**
     * @return array{0: User, 1: Company}
     */
    private function makePendingRegistration(): array
    {
        $admin = Admin::factory()->create();

        $quote = Quote::create([
            'quote_number' => 'Q-ONB-' . Str::random(6),
            'title' => 'オンボーディングテスト見積もり',
            'status' => 'contracted',
            'created_by' => $admin->id,
        ]);

        $version = QuoteVersion::create([
            'quote_id' => $quote->id,
            'version' => 1,
            'title' => $quote->title,
            'base_amount' => 100000,
            'discount_amount' => 0,
            'tax_rate' => 10,
            'tax_amount' => 10000,
            'total_amount' => 110000,
            'status' => 'approved',
            'is_current' => true,
            'created_by' => $admin->id,
        ]);
        $quote->update(['current_version_id' => $version->id]);

        QuoteItem::create([
            'quote_version_id' => $version->id,
            'name' => 'Webサイト制作一式',
            'item_type' => 'custom',
            'billing_type' => 'one_time',
            'quantity' => 1,
            'unit_price' => 100000,
            'amount' => 100000,
        ]);

        $user = User::create([
            'email' => 'onboarding-test@example.com',
            'password' => bcrypt('password123'),
            'status' => 'pending',
        ]);

        $company = Company::create([
            'name' => 'オンボーディングテスト株式会社',
            'company_type' => 'corporate',
            'status' => 'pending',
            'representative_email' => 'rep@example.com',
        ]);

        $user->companies()->attach($company->id, [
            'role' => 'owner',
            'is_primary' => true,
            'joined_at' => now(),
        ]);

        QuoteResponse::create([
            'quote_id' => $quote->id,
            'token' => Str::random(40),
            'email' => $user->email,
            'user_id' => $user->id,
            'company_id' => $company->id,
            'response_type' => 'request',
        ]);

        return [$user, $company];
    }

    private function actingAsOwner(): Admin
    {
        $owner = Admin::factory()->create(['role' => 'owner', 'status' => 'active']);
        $this->actingAs($owner, 'admins');

        return $owner;
    }

    public function test_approve_activates_user_and_company_and_creates_deposit_invoice(): void
    {
        $this->actingAsOwner();
        [$user, $company] = $this->makePendingRegistration();

        $response = $this->post(route('admin.onboarding.approve', $user->id));

        if ($response->getSession()->has('error')) {
            $this->fail('approve failed with error: ' . $response->getSession()->get('error'));
        }

        $response->assertRedirect(route('admin.onboarding.index'));

        $this->assertSame('active', $user->fresh()->status);
        $this->assertSame('active', $company->fresh()->status);

        $invoice = $company->fresh()->invoices()->latest()->first();
        $this->assertNotNull($invoice);
        $this->assertEquals(55000, (float) $invoice->total_amount); // 見積合計110,000円の50%

        // Invoice発行のために自動作成されたContractがQuoteの内容を引き継いでいること
        $contract = $invoice->contract;
        $this->assertNotNull($contract);
        $this->assertSame($user->id, $contract->user_id);
        $this->assertSame($company->id, $contract->company_id);
        $this->assertEquals(110000, (float) $contract->currentVersion->total_amount);
        $this->assertSame(1, $contract->currentVersion->items()->count());
        $this->assertSame('Webサイト制作一式', $contract->currentVersion->items()->first()->name);
    }

    public function test_reject_permanently_deletes_user_and_company_allowing_re_registration(): void
    {
        $this->actingAsOwner();
        [$user, $company] = $this->makePendingRegistration();
        $email = $user->email;

        $response = $this->post(route('admin.onboarding.reject', $user->id), [
            'reason' => 'テスト却下理由',
        ]);

        $response->assertRedirect(route('admin.onboarding.index'));

        // 論理削除ではなく物理削除されていること（withTrashedでも見つからない）
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
        $this->assertDatabaseMissing('companies', ['id' => $company->id]);

        // 却下後、同じメールアドレスで再度Userを新規作成できること
        // （論理削除のままだとemailのunique制約に阻まれて失敗する）
        $newUser = User::create([
            'email' => $email,
            'password' => bcrypt('password123'),
            'status' => 'pending',
        ]);

        $this->assertNotNull($newUser->id);
    }
}
