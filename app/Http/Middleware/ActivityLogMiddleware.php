<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\UserActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Jenssegers\Agent\Agent;

class ActivityLogMiddleware
{
    /**
     * 記録しないルート
     */
    private array $excludedRoutes = [
        'api.*',
        'telescope.*',
        'horizon.*',
        'debugbar.*',
        '_ignition.*',
        'livewire.*',
    ];

    /**
     * 記録しないアクション
     */
    private array $excludedActions = [
        'GET' => [
            'assets/*',
            'storage/*',
            'css/*',
            'js/*',
            'images/*',
            'favicon.ico',
            'robots.txt',
        ]
    ];

    /**
     * 特別に記録するアクション
     */
    private array $importantActions = [
        'POST' => [
            'login',
            'logout',
            'register',
            'password/*',
            'profile/*',
            'settings/*',
        ],
        'PUT' => [
            'profile/*',
            'settings/*',
            'password/*',
        ],
        'PATCH' => [
            'profile/*',
            'settings/*',
            'password/*',
        ],
        'DELETE' => [
            'profile/*',
            'account/*',
        ]
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);

        // リクエストを処理
        $response = $next($request);

        // 記録が必要かチェック
        if ($this->shouldLog($request, $response)) {
            $this->logActivity($request, $response, $startTime);
        }

        return $response;
    }

    /**
     * アクティビティを記録するかどうかを判定
     */
    private function shouldLog(Request $request, Response $response): bool
    {
        // 認証されていないユーザーはログインに関連するもの以外記録しない
        if (!Auth::guard('users')->check() && !$this->isAuthRelated($request)) {
            return false;
        }

        // 除外ルートをチェック
        if ($this->isExcludedRoute($request)) {
            return false;
        }

        // 除外アクションをチェック
        if ($this->isExcludedAction($request)) {
            return false;
        }

        // 重要なアクションは常に記録
        if ($this->isImportantAction($request)) {
            return true;
        }

        // GETリクエストは重要でない限り記録しない（リソースを節約）
        if ($request->isMethod('GET') && !$this->isImportantGetRequest($request)) {
            return false;
        }

        // エラーレスポンスは記録
        if ($response->getStatusCode() >= 400) {
            return true;
        }

        // その他のPOST, PUT, PATCH, DELETEは記録
        return in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE']);
    }

    /**
     * 認証関連のリクエストかどうか
     */
    private function isAuthRelated(Request $request): bool
    {
        $path = $request->path();
        return Str::contains($path, ['login', 'register', 'password', 'verify']);
    }

    /**
     * 除外ルートかどうか
     */
    private function isExcludedRoute(Request $request): bool
    {
        $routeName = $request->route()?->getName();

        if (!$routeName) {
            return false;
        }

        foreach ($this->excludedRoutes as $pattern) {
            if (Str::is($pattern, $routeName)) {
                return true;
            }
        }

        return false;
    }

    /**
     * 除外アクションかどうか
     */
    private function isExcludedAction(Request $request): bool
    {
        $method = $request->method();
        $path = $request->path();

        if (!isset($this->excludedActions[$method])) {
            return false;
        }

        foreach ($this->excludedActions[$method] as $pattern) {
            if (Str::is($pattern, $path)) {
                return true;
            }
        }

        return false;
    }

    /**
     * 重要なアクションかどうか
     */
    private function isImportantAction(Request $request): bool
    {
        $method = $request->method();
        $path = $request->path();

        if (!isset($this->importantActions[$method])) {
            return false;
        }

        foreach ($this->importantActions[$method] as $pattern) {
            if (Str::is($pattern, $path)) {
                return true;
            }
        }

        return false;
    }

    /**
     * 重要なGETリクエストかどうか
     */
    private function isImportantGetRequest(Request $request): bool
    {
        $routeName = $request->route()?->getName();

        // ダッシュボードやプロフィール表示など重要なページ
        $importantRoutes = [
            'dashboard',
            'profile.show',
            'profile.edit',
            'settings.*',
            'account.*',
        ];

        foreach ($importantRoutes as $pattern) {
            if (Str::is($pattern, $routeName)) {
                return true;
            }
        }

        return false;
    }

    /**
     * アクティビティをログに記録
     */
    private function logActivity(Request $request, Response $response, float $startTime): void
    {
        try {
            $user = Auth::guard('users')->user();
            $agent = new Agent();
            $agent->setUserAgent($request->userAgent());

            // デバイス情報を取得
            $deviceType = $this->getDeviceType($agent);
            $browser = $agent->browser();
            $platform = $agent->platform();

            // アクション名を決定
            $action = $this->determineAction($request, $response);

            // リクエストデータを準備（機密情報を除く）
            $requestData = $this->sanitizeRequestData($request->all());

            // レスポンス情報を準備
            $responseData = [
                'status_code' => $response->getStatusCode(),
                'processing_time' => round((microtime(true) - $startTime) * 1000, 2), // ミリ秒
            ];

            // ステータスを決定
            $status = $this->determineStatus($response);

            $data = [
                'user_id' => $user?->id,
                'action' => $action,
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'route_name' => $request->route()?->getName(),
                'request_data' => $requestData,
                'response_data' => $responseData,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'device_type' => $deviceType,
                'browser' => $browser,
                'platform' => $platform,
                'session_id' => $request->session()->getId(),
                'status' => $status,
                'description' => $this->generateDescription($request, $response, $action),
                'performed_at' => now(),
            ];

            UserActivityLog::create($data);
        } catch (\Exception $e) {
            // ログ記録でエラーが発生してもアプリケーションの動作を妨げない
            Log::error('ActivityLogMiddleware error: ' . $e->getMessage(), [
                'url' => $request->fullUrl(),
                'method' => $request->method(),
            ]);
        }
    }

    /**
     * デバイスタイプを取得
     */
    private function getDeviceType(Agent $agent): string
    {
        if ($agent->isMobile()) {
            return UserActivityLog::DEVICE_MOBILE;
        } elseif ($agent->isTablet()) {
            return UserActivityLog::DEVICE_TABLET;
        } else {
            return UserActivityLog::DEVICE_DESKTOP;
        }
    }

    /**
     * アクション名を決定
     */
    private function determineAction(Request $request, Response $response): string
    {
        $routeName = $request->route()?->getName();
        $method = $request->method();
        $path = $request->path();

        // 特定のルート名に基づく判定
        if ($routeName) {
            if (Str::contains($routeName, 'login')) {
                return UserActivityLog::ACTION_LOGIN;
            }
            if (Str::contains($routeName, 'logout')) {
                return UserActivityLog::ACTION_LOGOUT;
            }
            if (Str::contains($routeName, 'profile')) {
                return UserActivityLog::ACTION_PROFILE_UPDATE;
            }
            if (Str::contains($routeName, 'password')) {
                return UserActivityLog::ACTION_PASSWORD_CHANGE;
            }
            if (Str::contains($routeName, 'settings')) {
                return UserActivityLog::ACTION_SETTINGS_UPDATE;
            }
        }

        // HTTPメソッドに基づく判定
        switch ($method) {
            case 'GET':
                return UserActivityLog::ACTION_PAGE_VIEW;
            case 'POST':
                if (Str::contains($path, 'upload')) {
                    return UserActivityLog::ACTION_FILE_UPLOAD;
                }
                return 'create';
            case 'PUT':
            case 'PATCH':
                return 'update';
            case 'DELETE':
                return 'delete';
            default:
                return 'unknown';
        }
    }

    /**
     * リクエストデータをサニタイズ（機密情報を除去）
     */
    private function sanitizeRequestData(array $data): array
    {
        $sensitiveKeys = [
            'password',
            'password_confirmation',
            'current_password',
            'new_password',
            'token',
            'api_key',
            'secret',
            'private_key',
            'credit_card',
            'cvv',
            'ssn',
        ];

        foreach ($sensitiveKeys as $key) {
            if (isset($data[$key])) {
                $data[$key] = '[FILTERED]';
            }
        }

        // ネストした配列も処理
        array_walk_recursive($data, function (&$value, $key) use ($sensitiveKeys) {
            if (in_array(strtolower($key), $sensitiveKeys)) {
                $value = '[FILTERED]';
            }
        });

        return $data;
    }

    /**
     * ステータスを決定
     */
    private function determineStatus(Response $response): string
    {
        $statusCode = $response->getStatusCode();

        if ($statusCode >= 500) {
            return UserActivityLog::STATUS_ERROR;
        } elseif ($statusCode >= 400) {
            return UserActivityLog::STATUS_WARNING;
        } else {
            return UserActivityLog::STATUS_SUCCESS;
        }
    }

    /**
     * 説明文を生成
     */
    private function generateDescription(Request $request, Response $response, string $action): ?string
    {
        $routeName = $request->route()?->getName();
        $method = $request->method();
        $statusCode = $response->getStatusCode();

        $descriptions = [
            UserActivityLog::ACTION_LOGIN => 'ユーザーがログインしました',
            UserActivityLog::ACTION_LOGOUT => 'ユーザーがログアウトしました',
            UserActivityLog::ACTION_PROFILE_UPDATE => 'プロフィール情報を更新しました',
            UserActivityLog::ACTION_PASSWORD_CHANGE => 'パスワードを変更しました',
            UserActivityLog::ACTION_SETTINGS_UPDATE => '設定を更新しました',
            UserActivityLog::ACTION_PAGE_VIEW => $routeName ? "ページ「{$routeName}」を表示しました" : 'ページを表示しました',
            UserActivityLog::ACTION_FILE_UPLOAD => 'ファイルをアップロードしました',
        ];

        $description = $descriptions[$action] ?? "{$method}リクエストを実行しました";

        if ($statusCode >= 400) {
            $description .= " (エラー: {$statusCode})";
        }

        return $description;
    }
}
