<?php

namespace Tests\Unit;

use App\Models\Admin;
use App\Models\Contact;
use App\Models\ContactCategory;
use App\Models\Quote;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuoteObserverTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function makeContact(string $email): Contact
    {
        $category = ContactCategory::create([
            'name' => 'テストカテゴリ',
            'slug' => 'test-category',
        ]);

        return Contact::create([
            'contact_category_id' => $category->id,
            'name' => 'テスト太郎',
            'email' => $email,
            'message' => 'テストメッセージ',
        ]);
    }

    public function test_quote_creation_auto_links_user_by_contact_email(): void
    {
        $user = User::factory()->create(['email' => 'match@example.com']);
        $contact = $this->makeContact('match@example.com');

        $quote = Quote::create([
            'quote_number' => 'Q-TEST-0001',
            'contact_id' => $contact->id,
            'title' => 'テスト見積もり',
            'status' => 'draft',
            'created_by' => Admin::factory()->create()->id,
        ]);

        $this->assertSame($user->id, $quote->fresh()->user_id);
    }

    public function test_quote_creation_does_not_overwrite_explicit_user_id(): void
    {
        $matchingUser = User::factory()->create(['email' => 'match2@example.com']);
        $explicitUser = User::factory()->create(['email' => 'explicit@example.com']);
        $contact = $this->makeContact('match2@example.com');

        $quote = Quote::create([
            'quote_number' => 'Q-TEST-0002',
            'contact_id' => $contact->id,
            'user_id' => $explicitUser->id,
            'title' => 'テスト見積もり',
            'status' => 'draft',
            'created_by' => Admin::factory()->create()->id,
        ]);

        $this->assertSame($explicitUser->id, $quote->fresh()->user_id);
        $this->assertNotSame($matchingUser->id, $quote->fresh()->user_id);
    }

    public function test_quote_creation_leaves_user_id_null_when_no_matching_user(): void
    {
        $contact = $this->makeContact('nomatch@example.com');

        $quote = Quote::create([
            'quote_number' => 'Q-TEST-0003',
            'contact_id' => $contact->id,
            'title' => 'テスト見積もり',
            'status' => 'draft',
            'created_by' => Admin::factory()->create()->id,
        ]);

        $this->assertNull($quote->fresh()->user_id);
    }
}
