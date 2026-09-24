<?php

namespace App\Services;

use App\Models\Admin;
use App\Models\AiStaffActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

/**
 * AI社員の業務アクションを ai_staff_activity_logs へ記録する横断的な記録係。
 * BaseService（単一エンティティのCRUD想定）は継承しない。
 */
class AiStaffActivityLogger
{
    /**
     * @param  Admin  $admin  この操作の主体（人間Adminの場合は何もしない）
     * @param  string  $action  AiStaffActivityLog::ACTION_* のいずれか
     * @param  string  $description  一覧・日報にそのまま使える一言
     * @param  Model|null  $subject  対象レコード（Task/Response/Quote/Proposal）
     */
    public function log(Admin $admin, string $action, string $description, ?Model $subject = null): void
    {
        if (! $admin->isAiStaff()) {
            return;
        }

        try {
            AiStaffActivityLog::create([
                'admin_id' => $admin->id,
                'action' => $action,
                'subject_type' => $subject ? $subject::class : null,
                'subject_id' => $subject?->getKey(),
                'description' => $description,
                'occurred_at' => now(),
            ]);
        } catch (\Throwable $e) {
            Log::error('AI社員の活動ログ記録に失敗しました', [
                'admin_id' => $admin->id,
                'action' => $action,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
