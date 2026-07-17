<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Appointment;
use App\Models\Campaign;
use App\Models\Company;
use App\Models\Contact;
use App\Models\Contract;
use App\Models\Invoice;
use App\Models\MembershipRank;
use App\Models\Project;
use App\Models\Profile;
use App\Models\Quote;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    /**
     * 1カテゴリあたりの最大表示件数
     */
    private const LIMIT_PER_CATEGORY = 8;

    /**
     * 全体検索結果画面
     */
    public function index(Request $request): Response
    {
        $query = trim((string) $request->input('q', ''));

        $results = $query === '' ? [] : $this->search($query);

        return Inertia::render('Admin/Search/Index', [
            'query' => $query,
            'results' => $results,
            'totalCount' => array_sum(array_column($results, 'total')),
        ]);
    }

    /**
     * 各モデルを横断検索する
     */
    private function search(string $query): array
    {
        $categories = [
            $this->searchCompanies($query),
            $this->searchUsers($query),
            $this->searchAdmins($query),
            $this->searchProjects($query),
            $this->searchContracts($query),
            $this->searchQuotes($query),
            $this->searchInvoices($query),
            $this->searchContacts($query),
            $this->searchAppointments($query),
            $this->searchServices($query),
            $this->searchCampaigns($query),
            $this->searchMembershipRanks($query),
        ];

        // 該当件数のあるカテゴリのみ返す
        return array_values(array_filter($categories, fn ($category) => $category['total'] > 0));
    }

    private function searchCompanies(string $query): array
    {
        $items = Company::query()
            ->where(fn (Builder $q) => $q
                ->where('name', 'LIKE', "%{$query}%")
                ->orWhere('email', 'LIKE', "%{$query}%"))
            ->limit(self::LIMIT_PER_CATEGORY)
            ->get();

        return $this->formatCategory('companies', '会社', $items, fn ($company) => [
            'id' => $company->id,
            'title' => $company->name,
            'subtitle' => $company->email,
            'url' => route('admin.company.show', $company->id),
        ]);
    }

    private function searchUsers(string $query): array
    {
        $items = User::query()
            ->with('profile')
            ->where(fn (Builder $q) => $q
                ->where('email', 'LIKE', "%{$query}%")
                ->orWhereHas('profile', fn (Builder $p) => $p
                    ->where('last_name', 'LIKE', "%{$query}%")
                    ->orWhere('first_name', 'LIKE', "%{$query}%")))
            ->limit(self::LIMIT_PER_CATEGORY)
            ->get();

        return $this->formatCategory('users', '顧客', $items, fn ($user) => [
            'id' => $user->id,
            'title' => $this->fullName($user->profile) ?: $user->email,
            'subtitle' => $user->email,
            'url' => route('admin.user.show', $user->id),
        ]);
    }

    private function searchAdmins(string $query): array
    {
        $items = Admin::query()
            ->with('profile')
            ->where(fn (Builder $q) => $q
                ->where('email', 'LIKE', "%{$query}%")
                ->orWhereHas('profile', fn (Builder $p) => $p
                    ->where('last_name', 'LIKE', "%{$query}%")
                    ->orWhere('first_name', 'LIKE', "%{$query}%")))
            ->limit(self::LIMIT_PER_CATEGORY)
            ->get();

        return $this->formatCategory('admins', '管理者', $items, fn ($admin) => [
            'id' => $admin->id,
            'title' => $this->fullName($admin->profile) ?: $admin->email,
            'subtitle' => $admin->email,
            'url' => route('admin.admin.show', $admin->id),
        ]);
    }

    private function searchProjects(string $query): array
    {
        $items = Project::query()
            ->where(fn (Builder $q) => $q
                ->where('title', 'LIKE', "%{$query}%")
                ->orWhere('project_code', 'LIKE', "%{$query}%"))
            ->limit(self::LIMIT_PER_CATEGORY)
            ->get();

        return $this->formatCategory('projects', 'プロジェクト', $items, fn ($project) => [
            'id' => $project->id,
            'title' => $project->title,
            'subtitle' => $project->project_code,
            'url' => route('admin.project.show', $project->id),
        ]);
    }

    private function searchContracts(string $query): array
    {
        $items = Contract::query()
            ->where(fn (Builder $q) => $q
                ->where('title', 'LIKE', "%{$query}%")
                ->orWhere('contract_number', 'LIKE', "%{$query}%"))
            ->limit(self::LIMIT_PER_CATEGORY)
            ->get();

        return $this->formatCategory('contracts', '契約', $items, fn ($contract) => [
            'id' => $contract->id,
            'title' => $contract->title ?: $contract->contract_number,
            'subtitle' => $contract->contract_number,
            'url' => route('admin.contract.show', $contract->id),
        ]);
    }

    private function searchQuotes(string $query): array
    {
        $items = Quote::query()
            ->where(fn (Builder $q) => $q
                ->where('quote_number', 'LIKE', "%{$query}%")
                ->orWhere('title', 'LIKE', "%{$query}%"))
            ->limit(self::LIMIT_PER_CATEGORY)
            ->get();

        return $this->formatCategory('quotes', '見積', $items, fn ($quote) => [
            'id' => $quote->id,
            'title' => $quote->title ?: $quote->quote_number,
            'subtitle' => $quote->quote_number,
            'url' => route('admin.quote.show', $quote->id),
        ]);
    }

    private function searchInvoices(string $query): array
    {
        $items = Invoice::query()
            ->where('invoice_number', 'LIKE', "%{$query}%")
            ->limit(self::LIMIT_PER_CATEGORY)
            ->get();

        return $this->formatCategory('invoices', '請求書', $items, fn ($invoice) => [
            'id' => $invoice->id,
            'title' => $invoice->invoice_number,
            'subtitle' => $invoice->status,
            'url' => route('admin.invoice.show', $invoice->id),
        ]);
    }

    private function searchContacts(string $query): array
    {
        $items = Contact::query()
            ->where(fn (Builder $q) => $q
                ->where('name', 'LIKE', "%{$query}%")
                ->orWhere('email', 'LIKE', "%{$query}%")
                ->orWhere('subject', 'LIKE', "%{$query}%"))
            ->limit(self::LIMIT_PER_CATEGORY)
            ->get();

        return $this->formatCategory('contacts', 'お問い合わせ', $items, fn ($contact) => [
            'id' => $contact->id,
            'title' => $contact->subject ?: $contact->name,
            'subtitle' => "{$contact->name} / {$contact->email}",
            'url' => route('admin.contact.show', $contact->id),
        ]);
    }

    private function searchAppointments(string $query): array
    {
        $items = Appointment::query()
            ->where(fn (Builder $q) => $q
                ->where('subject', 'LIKE', "%{$query}%")
                ->orWhere('guest_name', 'LIKE', "%{$query}%")
                ->orWhere('guest_email', 'LIKE', "%{$query}%"))
            ->limit(self::LIMIT_PER_CATEGORY)
            ->get();

        return $this->formatCategory('appointments', '面談予約', $items, fn ($appointment) => [
            'id' => $appointment->id,
            'title' => $appointment->subject ?: '面談予約',
            'subtitle' => $appointment->guest_name,
            'url' => route('admin.appointments.show', $appointment->id),
        ]);
    }

    private function searchServices(string $query): array
    {
        $items = Service::query()
            ->where(fn (Builder $q) => $q
                ->where('name', 'LIKE', "%{$query}%")
                ->orWhere('slug', 'LIKE', "%{$query}%"))
            ->limit(self::LIMIT_PER_CATEGORY)
            ->get();

        return $this->formatCategory('services', 'サービス', $items, fn ($service) => [
            'id' => $service->id,
            'title' => $service->name,
            'subtitle' => $service->slug,
            'url' => route('admin.service.show', $service->id),
        ]);
    }

    private function searchCampaigns(string $query): array
    {
        $items = Campaign::query()
            ->where(fn (Builder $q) => $q
                ->where('name', 'LIKE', "%{$query}%")
                ->orWhere('code', 'LIKE', "%{$query}%"))
            ->limit(self::LIMIT_PER_CATEGORY)
            ->get();

        return $this->formatCategory('campaigns', 'キャンペーン', $items, fn ($campaign) => [
            'id' => $campaign->id,
            'title' => $campaign->name,
            'subtitle' => $campaign->code,
            'url' => route('admin.campaign.show', $campaign->id),
        ]);
    }

    private function searchMembershipRanks(string $query): array
    {
        $items = MembershipRank::query()
            ->where(fn (Builder $q) => $q
                ->where('name', 'LIKE', "%{$query}%")
                ->orWhere('key', 'LIKE', "%{$query}%"))
            ->limit(self::LIMIT_PER_CATEGORY)
            ->get();

        // show ルートが存在しないため編集画面へリンクする
        return $this->formatCategory('membershipRanks', '会員ランク', $items, fn ($rank) => [
            'id' => $rank->id,
            'title' => $rank->name,
            'subtitle' => $rank->key,
            'url' => route('admin.membership-rank.edit', $rank->id),
        ]);
    }

    /**
     * カテゴリ単位の結果配列を組み立てる
     */
    private function formatCategory(string $key, string $label, iterable $items, \Closure $mapper): array
    {
        $mapped = collect($items)->map($mapper)->values()->all();

        return [
            'key' => $key,
            'label' => $label,
            'items' => $mapped,
            'total' => count($mapped),
        ];
    }

    private function fullName(?Profile $profile): string
    {
        if (!$profile) {
            return '';
        }

        return trim("{$profile->last_name} {$profile->first_name}");
    }
}
