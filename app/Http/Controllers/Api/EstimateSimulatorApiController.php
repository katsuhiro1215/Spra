<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\EstimateSimulatorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * 外部サイト(かつコード等)からの見積もりシミュレーターAPI連携コントローラー
 * VerifyContactApiKey ミドルウェアで認証済みのリクエストのみ到達する
 */
class EstimateSimulatorApiController extends Controller
{
    public function __construct(
        private EstimateSimulatorService $estimateSimulatorService,
    ) {}

    /**
     * 連携先で見積もりシミュレーターUIを組み立てるための選択肢
     * （サービスカテゴリ・サービス・プラン・追加項目）を返す
     */
    public function options(): JsonResponse
    {
        return response()->json(
            $this->estimateSimulatorService->getSimulatorOptions()
        );
    }

    /**
     * 外部サイトからの見積依頼を受け付ける。
     * Spra側にログインアカウントを持たない訪問者からの送信のため、常にゲスト扱いする。
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'service_id' => ['required', 'exists:services,id'],
            'service_plan_id' => ['required', 'exists:service_plans,id'],
            'selected_addon_ids' => ['nullable', 'array'],
            'selected_addon_ids.*' => ['string', 'exists:service_items,id'],
            'title' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'company' => ['nullable', 'string', 'max:255'],
            // 連携元(かつコード等)が $_SERVER から転送する実訪問者の情報
            // サーバー間通信のため $request->ip() 等は連携元サーバー自身の値になってしまう
            'page_url' => ['nullable', 'string', 'max:2048'],
            'visitor_ip' => ['nullable', 'string', 'max:45'],
            'visitor_user_agent' => ['nullable', 'string', 'max:512'],
        ]);

        $apiClient = $request->attributes->get('contactApiClient');

        try {
            $quote = $this->estimateSimulatorService->createEstimateRequest($validated, null, [
                'source' => 'estimate_simulator_api',
                'api_client_id' => $apiClient?->id,
                'ip_address' => $validated['visitor_ip'] ?? $request->ip(),
                'user_agent' => $validated['visitor_user_agent'] ?? $request->userAgent(),
            ]);
        } catch (\RuntimeException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        } catch (\Exception $e) {
            Log::error('外部API見積シミュレーター送信エラー: '.$e->getMessage(), [
                'api_client_id' => $apiClient?->id,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['success' => false, 'message' => '見積依頼の登録に失敗しました。'], 500);
        }

        Log::info('外部API経由で見積依頼を受信しました', [
            'quote_id' => $quote->id,
            'api_client_id' => $apiClient?->id,
        ]);

        return response()->json([
            'success' => true,
            'quote' => [
                'quote_number' => $quote->quote_number,
                'title' => $quote->title,
                'base_amount' => $quote->currentVersion->base_amount,
                'tax_amount' => $quote->currentVersion->tax_amount,
                'total_amount' => $quote->currentVersion->total_amount,
            ],
        ]);
    }
}
