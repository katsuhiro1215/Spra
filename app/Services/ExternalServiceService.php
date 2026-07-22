<?php

namespace App\Services;

use App\Models\ExternalService;
use App\Repositories\ExternalServiceRepository;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

class ExternalServiceService extends BaseService
{
    public function __construct(ExternalServiceRepository $repository)
    {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'ExternalService';
    }

    /**
     * 外部サービスのAPIからデータを取得し、キャッシュとして保存する
     */
    public function sync(ExternalService $service): ExternalService
    {
        if (! $service->hasApiIntegration()) {
            $service->update([
                'last_synced_at' => now(),
                'last_sync_status' => 'failed',
                'last_sync_error' => 'APIのベースURLが設定されていません。',
            ]);

            return $service->fresh();
        }

        $url = rtrim($service->api_base_url, '/') . '/' . ltrim($service->api_endpoint ?? '', '/');

        try {
            $response = $this->applyAuth(Http::timeout(10), $service)->get($url);

            if ($response->successful()) {
                $service->update([
                    'cached_data' => $response->json() ?? ['raw' => $response->body()],
                    'last_synced_at' => now(),
                    'last_sync_status' => 'success',
                    'last_sync_error' => null,
                ]);
            } else {
                $service->update([
                    'last_synced_at' => now(),
                    'last_sync_status' => 'failed',
                    'last_sync_error' => "HTTPエラー: {$response->status()}",
                ]);
            }
        } catch (\Throwable $e) {
            $service->update([
                'last_synced_at' => now(),
                'last_sync_status' => 'failed',
                'last_sync_error' => $e->getMessage(),
            ]);

            $this->logError('sync_failed', new \Exception($e->getMessage()), $service->id);
        }

        return $service->fresh();
    }

    private function applyAuth(PendingRequest $request, ExternalService $service): PendingRequest
    {
        return match ($service->auth_type) {
            ExternalService::AUTH_BEARER => $request->withToken((string) $service->credential),
            ExternalService::AUTH_API_KEY => $request->withHeaders([
                ($service->auth_header ?: 'X-Api-Key') => (string) $service->credential,
            ]),
            ExternalService::AUTH_BASIC => $this->applyBasicAuth($request, (string) $service->credential),
            default => $request,
        };
    }

    private function applyBasicAuth(PendingRequest $request, string $credential): PendingRequest
    {
        [$user, $pass] = array_pad(explode(':', $credential, 2), 2, '');

        return $request->withBasicAuth($user, $pass);
    }
}
