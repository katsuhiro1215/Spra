<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class UserActivityLog extends Model
{
    use HasUlid, HasFactory;

    protected $fillable = [
        'user_id',
        'actor_type',
        'admin_id',
        'action',
        'method',
        'url',
        'route_name',
        'request_data',
        'response_data',
        'ip_address',
        'user_agent',
        'device_type',
        'browser',
        'platform',
        'session_id',
        'status',
        'description',
        'additional_data',
        'performed_at',
    ];

    protected $casts = [
        'request_data' => 'array',
        'response_data' => 'array',
        'additional_data' => 'array',
        'performed_at' => 'datetime',
    ];

    // アクションタイプの定数
    const ACTION_LOGIN = 'login';
    const ACTION_LOGOUT = 'logout';
    const ACTION_PROFILE_UPDATE = 'profile_update';
    const ACTION_PASSWORD_CHANGE = 'password_change';
    const ACTION_EMAIL_CHANGE = 'email_change';
    const ACTION_ACCOUNT_DELETE = 'account_delete';
    const ACTION_PAGE_VIEW = 'page_view';
    const ACTION_FILE_UPLOAD = 'file_upload';
    const ACTION_FILE_DOWNLOAD = 'file_download';
    const ACTION_SETTINGS_UPDATE = 'settings_update';
    const ACTION_DATA_EXPORT = 'data_export';
    const ACTION_CONTACT_RECEIVED = 'contact_received';
    const ACTION_QUOTE_RESPONSE_RECEIVED = 'quote_response_received';

    // ステータスの定数
    const STATUS_SUCCESS = 'success';
    const STATUS_ERROR = 'error';
    const STATUS_WARNING = 'warning';

    // 操作主体タイプの定数
    const ACTOR_USER = 'user';
    const ACTOR_ADMIN = 'admin';
    const ACTOR_SYSTEM = 'system';

    // デバイスタイプの定数
    const DEVICE_DESKTOP = 'desktop';
    const DEVICE_MOBILE = 'mobile';
    const DEVICE_TABLET = 'tablet';

    // リレーション
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }

    // スコープ
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByAction($query, $action)
    {
        return $query->where('action', $action);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('performed_at', [$startDate, $endDate]);
    }

    public function scopeByRoutePrefix($query, string $prefix)
    {
        return $query->where('route_name', 'like', $prefix . '%');
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('performed_at', '>=', Carbon::now()->subDays($days));
    }

    public function scopeToday($query)
    {
        return $query->whereDate('performed_at', Carbon::today());
    }

    // アクセサ
    public function getActionNameAttribute(): string
    {
        $actions = [
            self::ACTION_LOGIN => 'ログイン',
            self::ACTION_LOGOUT => 'ログアウト',
            self::ACTION_PROFILE_UPDATE => 'プロフィール更新',
            self::ACTION_PASSWORD_CHANGE => 'パスワード変更',
            self::ACTION_EMAIL_CHANGE => 'メールアドレス変更',
            self::ACTION_ACCOUNT_DELETE => 'アカウント削除',
            self::ACTION_PAGE_VIEW => 'ページ閲覧',
            self::ACTION_FILE_UPLOAD => 'ファイルアップロード',
            self::ACTION_FILE_DOWNLOAD => 'ファイルダウンロード',
            self::ACTION_SETTINGS_UPDATE => '設定更新',
            self::ACTION_DATA_EXPORT => 'データエクスポート',
            self::ACTION_CONTACT_RECEIVED => 'お問い合わせ受信',
            self::ACTION_QUOTE_RESPONSE_RECEIVED => '見積返信受信',
        ];

        return $actions[$this->action] ?? $this->action;
    }

    public function getStatusNameAttribute(): string
    {
        $statuses = [
            self::STATUS_SUCCESS => '成功',
            self::STATUS_ERROR => 'エラー',
            self::STATUS_WARNING => '警告',
        ];

        return $statuses[$this->status] ?? $this->status;
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_SUCCESS => 'green',
            self::STATUS_ERROR => 'red',
            self::STATUS_WARNING => 'yellow',
            default => 'gray'
        };
    }

    // ヘルパーメソッド
    public static function logActivity(array $data): self
    {
        $data['performed_at'] = $data['performed_at'] ?? now();

        return self::create($data);
    }

    public static function logUserActivity($userId, $action, array $additionalData = []): self
    {
        $request = request();

        $data = array_merge([
            'user_id' => $userId,
            'actor_type' => self::ACTOR_USER,
            'action' => $action,
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'route_name' => $request->route()?->getName(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'session_id' => $request->session()?->getId(),
            'status' => self::STATUS_SUCCESS,
        ], $additionalData);

        return self::logActivity($data);
    }

    public static function logAdminActivity($adminId, $action, array $additionalData = []): self
    {
        $request = request();

        $data = array_merge([
            'admin_id' => $adminId,
            'actor_type' => self::ACTOR_ADMIN,
            'action' => $action,
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'route_name' => $request->route()?->getName(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'session_id' => $request->session()?->getId(),
            'status' => self::STATUS_SUCCESS,
        ], $additionalData);

        return self::logActivity($data);
    }

    public function isSuccessful(): bool
    {
        return $this->status === self::STATUS_SUCCESS;
    }

    public function isError(): bool
    {
        return $this->status === self::STATUS_ERROR;
    }

    public function isWarning(): bool
    {
        return $this->status === self::STATUS_WARNING;
    }
}
