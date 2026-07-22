<?php

namespace App\Http\Controllers\Admin\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\AdminEmployment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AdminEmploymentController extends Controller
{
    /**
     * 雇用条件・給与設定更新処理（管理者詳細画面「設定」タブから直接更新）
     */
    public function update(Request $request, Admin $admin): RedirectResponse
    {
        $validated = $request->validate([
            'employment_type' => ['required', Rule::in(array_keys(AdminEmployment::EMPLOYMENT_TYPES))],
            'pay_type' => ['required', Rule::in(array_keys(AdminEmployment::PAY_TYPES))],
            'base_salary' => ['nullable', 'numeric', 'min:0', 'required_if:pay_type,monthly'],
            'hourly_wage' => ['nullable', 'numeric', 'min:0', 'required_if:pay_type,hourly'],
        ], [], [
            'employment_type' => '雇用形態',
            'pay_type' => '給与体系',
            'base_salary' => '基本給',
            'hourly_wage' => '時給',
        ]);

        $adminId = Auth::guard('admins')->id();

        $admin->employment()->updateOrCreate(
            ['admin_id' => $admin->id],
            [
                ...$validated,
                'created_by' => $admin->employment?->created_by ?? $adminId,
                'updated_by' => $adminId,
            ]
        );

        return redirect()
            ->route('admin.admin.show', $admin)
            ->with('success', __('messages.updated', ['attribute' => '雇用条件・給与設定']));
    }
}
