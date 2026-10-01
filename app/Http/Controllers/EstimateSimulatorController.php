<?php

namespace App\Http\Controllers;

use App\Services\EstimateSimulatorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class EstimateSimulatorController extends Controller
{
    public function __construct(
        private EstimateSimulatorService $estimateSimulatorService,
    ) {}

    /**
     * 見積もりシミュレーター画面を表示
     */
    public function index(): InertiaResponse
    {
        return Inertia::render('Public/EstimateSimulator', [
            ...$this->estimateSimulatorService->getSimulatorOptions(),
            'canLogin' => route('user.login'),
            'canRegister' => Route::has('user.register') ? route('user.register') : null,
        ]);
    }

    /**
     * シミュレーション結果から「見積依頼」のお問い合わせと、
     * 管理者が確認・調整するためのQuote（ドラフト）を作成する。
     * ログイン不要（ゲストも送信可能）。
     */
    public function save(Request $request): RedirectResponse
    {
        $user = auth('users')->user();
        $isGuest = ! $user;

        $rules = [
            'service_id' => ['required', 'exists:services,id'],
            'service_plan_id' => ['required', 'exists:service_plans,id'],
            'selected_addon_ids' => ['nullable', 'array'],
            'selected_addon_ids.*' => ['string', 'exists:service_items,id'],
            'estimated_price' => ['required', 'numeric', 'min:0'],
            'estimated_days' => ['nullable', 'integer', 'min:0'],
            'title' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];

        if ($isGuest) {
            $rules['name'] = ['required', 'string', 'max:255'];
            $rules['email'] = ['required', 'email', 'max:255'];
            $rules['phone'] = ['nullable', 'string', 'max:20'];
            $rules['company'] = ['nullable', 'string', 'max:255'];
        }

        $validated = $request->validate($rules);

        try {
            $this->estimateSimulatorService->createEstimateRequest($validated, $user, [
                'source' => 'estimate_simulator',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        } catch (\RuntimeException $e) {
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }

        return back()->with('success', '見積もり依頼を送信しました。担当者より2営業日以内にご連絡いたします。');
    }
}
