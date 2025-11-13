<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SystemSettingRequest;
use App\Models\SystemSetting;
use Inertia\Inertia;
use Inertia\Response;

class SystemSettingController extends Controller
{
    /**
     * システム設定一覧
     */
    public function index(): Response
    {
        $systemSettings = SystemSetting::all();
        return Inertia::render('Admin/SystemSetting/Index', [
            'systemSettings' => $systemSettings,
        ]);
    }

    /**
     * システム設定詳細
     */
    public function show(SystemSetting $systemSetting)
    {
        return Inertia::render('Admin/SystemSetting/Show', [
            'systemSetting' => $systemSetting,
        ]);
    }

    /**
     * システム設定編集
     */
    public function edit(SystemSetting $systemSetting)
    {
        return Inertia::render('Admin/SystemSetting/Edit', [
            'systemSetting' => $systemSetting,
        ]);
    }

    /**
     * システム設定更新
     */
    public function update(SystemSettingRequest $request, SystemSetting $systemSetting)
    {
        $validated = $request->validated();

        $systemSetting->update($validated);

        return redirect()->route('admin.systemSetting.show', $systemSetting)
            ->with('success', __('messages.system_setting.update_success'));
    }
}
