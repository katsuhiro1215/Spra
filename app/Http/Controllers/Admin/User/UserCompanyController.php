<?php

namespace App\Http\Controllers\Admin\User;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use App\Services\CompanyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Userと既存Companyの紐付け（company_userピボット）を管理する
 *
 * Admin手動作成のUser/Companyは、公開URL経由の自己登録フロー
 * （QuoteResponseController::registerStore()）と異なりcompany_userへの
 * 自動紐付けが行われないため、ここで手動で紐付けられるようにする。
 */
class UserCompanyController extends Controller
{
    public function __construct(
        private CompanyService $companyService
    ) {}

    /**
     * 既存のCompanyをUserに紐付ける
     */
    public function store(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'company_id' => ['required', 'exists:companies,id'],
            'role' => ['required', 'in:owner,member,employee'],
        ], [
            'company_id.required' => '会社を選択してください。',
            'company_id.exists' => '選択された会社が見つかりません。',
        ]);

        $company = Company::findOrFail($validated['company_id']);

        // 最初に紐付ける会社を主所属として扱う
        $isPrimary = $user->companies()->count() === 0;

        try {
            $this->companyService->attachUser($company, $user->id, $validated['role'], $isPrimary);
        } catch (\Illuminate\Database\QueryException $e) {
            // company_userのunique(user_id, company_id)制約違反（既に紐付け済み）
            Log::warning('User company attach duplicate', ['user_id' => $user->id, 'company_id' => $company->id]);
            return back()->with('error', 'この会社は既にこのユーザーに紐付けられています。');
        }

        return redirect()
            ->route('admin.user.show', $user)
            ->with('success', __('messages.added', ['attribute' => '所属会社']));
    }

    /**
     * Userと会社の紐付けを解除する
     */
    public function destroy(User $user, Company $company): RedirectResponse
    {
        $this->companyService->detachUser($company, $user->id);

        return redirect()
            ->route('admin.user.show', $user)
            ->with('success', __('messages.deleted', ['attribute' => '所属会社']));
    }
}
