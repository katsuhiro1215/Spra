<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

class Contract extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'contract_number',
        'contract_group_id',
        'parent_contract_id',
        'quote_id',
        'service_plan_id',
        'user_id',
        'company_id',
        'title',
        'description',
        'current_version_id',
        'type',
        'start_date',
        'end_date',
        'status',
        'signature_status',
        'signature_required_from',
        'signed_at',
        'user_signed_at',
        'admin_signed_at',
        'terminated_at',
        'termination_reason',
        'auto_renewal',
        'renewal_notice_days',
        'billing_day',
        'payment_due_days',
        'auto_invoice_generation',
        'next_billing_date',
        'last_invoiced_at',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'start_date'             => 'date',
        'end_date'               => 'date',
        'signed_at'              => 'datetime',
        'user_signed_at'         => 'datetime',
        'admin_signed_at'        => 'datetime',
        'terminated_at'          => 'datetime',
        'next_billing_date'      => 'datetime',
        'last_invoiced_at'       => 'datetime',
        'auto_renewal'           => 'boolean',
        'auto_invoice_generation' => 'boolean',
    ];

    public const TYPES = [
        'one_time' => '一括払い',
        'monthly'  => '月額',
        'annual'   => '年額',
    ];

    public const STATUSES = [
        'draft'             => '下書き',
        'pending_signature' => '署名待ち',
        'active'            => '契約中',
        'suspended'         => '一時停止',
        'completed'         => '完了',
        'cancelled'         => 'キャンセル',
    ];

    public function project(): HasOne
    {
        return $this->hasOne(Project::class);
    }

    public function contractGroup(): BelongsTo
    {
        return $this->belongsTo(ContractGroup::class);
    }

    public function parentContract(): BelongsTo
    {
        return $this->belongsTo(Contract::class, 'parent_contract_id');
    }

    public function childContracts(): HasMany
    {
        return $this->hasMany(Contract::class, 'parent_contract_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    /**
     * この契約の元になったServicePlan（契約特典の算出に使用。未設定の場合は繰越なしとして扱う）
     */
    public function servicePlan(): BelongsTo
    {
        return $this->belongsTo(ServicePlan::class);
    }

    /**
     * 契約特典（期間ごとのチケット付与バッチ）
     */
    public function benefits(): HasMany
    {
        return $this->hasMany(ContractBenefit::class);
    }

    /**
     * 全てのContractVersions
     */
    public function versions(): HasMany
    {
        return $this->hasMany(ContractVersion::class)->orderBy('version', 'asc');
    }

    /**
     * 現在のContractVersion
     */
    public function currentVersion(): BelongsTo
    {
        return $this->belongsTo(ContractVersion::class, 'current_version_id');
    }

    /**
     * 作成者（管理者）
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    /**
     * 更新者（管理者）
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ContractDocument::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function histories(): HasMany
    {
        return $this->hasMany(ContractHistory::class);
    }

    public function signatures(): HasMany
    {
        return $this->hasMany(ContractSignature::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForClient($query, string $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isMonthly(): bool
    {
        return $this->type === 'monthly';
    }

    /**
     * 継続契約かどうか
     */
    public function isRecurring(): bool
    {
        return in_array($this->type, ['monthly', 'annual']);
    }

    /**
     * 既に請求済みの金額（キャンセル済みの請求書を除く）
     *
     * $excludeInvoiceId を指定すると、その請求書自身を除いて集計する
     * （既存請求書の編集時に自分自身の金額を二重に差し引かないため）
     */
    public function invoicedAmount(?string $excludeInvoiceId = null): float
    {
        return (float) $this->invoices()
            ->where('status', '!=', 'cancelled')
            ->when($excludeInvoiceId, fn($query) => $query->where('id', '!=', $excludeInvoiceId))
            ->sum('total_amount');
    }

    /**
     * 未請求の残額（契約金額 - 既に請求済みの金額）
     *
     * 一括払い契約(one_time)向けの概念。月額/年額の継続契約は請求サイクルが
     * 繰り返されるため「残金」という概念自体が馴染まず、呼び出し側で
     * isRecurring() をチェックした上で使うこと。
     */
    public function remainingAmount(?string $excludeInvoiceId = null): float
    {
        $contractTotal = (float) ($this->currentVersion?->total_amount ?? 0);

        return max($contractTotal - $this->invoicedAmount($excludeInvoiceId), 0);
    }

    /**
     * 値上げ・更新時に新しい契約を作成
     */
    public function renew(array $data = []): Contract
    {
        $newContract = $this->replicate();
        $newContract->parent_contract_id = $this->id;
        $newContract->contract_number = self::generateContractNumber();
        $newContract->status = 'draft';
        $newContract->signed_at = null;

        // データを上書き（値上げなど）
        foreach ($data as $key => $value) {
            $newContract->$key = $value;
        }

        $newContract->save();

        return $newContract;
    }

    /**
     * 契約番号を生成
     */
    public static function generateContractNumber(): string
    {
        $year = date('Y');
        $lastContract = self::whereYear('created_at', $year)
            ->orderBy('contract_number', 'desc')
            ->first();

        if ($lastContract && preg_match('/C(\d{4})-(\d+)/', $lastContract->contract_number, $matches)) {
            $nextNumber = intval($matches[2]) + 1;
        } else {
            $nextNumber = 1;
        }

        return sprintf('C%s-%03d', $year, $nextNumber);
    }

    public function getTaxIncludedAmountAttribute(): float
    {
        return $this->amount * (1 + $this->tax_rate / 100);
    }

    public function getStatusNameAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }

    public function getTypeNameAttribute(): string
    {
        return self::TYPES[$this->type] ?? $this->type;
    }

    /**
     * 次回請求日を計算
     */
    public function calculateNextBillingDate(): Carbon
    {
        $baseDate = $this->last_invoiced_at ?? $this->start_date;
        $nextDate = Carbon::parse($baseDate)->addMonth();

        // 指定された日付に設定（月末を超える場合は月末に）
        $daysInMonth = $nextDate->daysInMonth;
        $billingDay = min($this->billing_day, $daysInMonth);

        return $nextDate->day($billingDay);
    }

    /**
     * 請求対象かチェック
     */
    public function shouldGenerateInvoice(): bool
    {
        // 自動生成がオフの場合
        if (!$this->auto_invoice_generation) {
            return false;
        }

        // 月額契約でない場合
        if ($this->type !== 'monthly') {
            return false;
        }

        // 契約が有効でない場合
        if ($this->status !== 'active') {
            return false;
        }

        // 次回請求日が設定されていない、または次回請求日が過ぎている
        return !$this->next_billing_date || now()->gte($this->next_billing_date);
    }

    /**
     * ドラフト作成可能かチェック
     * 最小要件: User と Company が存在
     */
    public function canCreateDraft(): bool
    {
        return $this->user_id && $this->company_id;
    }

    /**
     * 契約書送信可能かチェック
     * 必須: User.Profile、Company、Company.Address、Quote が完全
     */
    public function canSend(): bool
    {
        return empty($this->getMissingRequirements());
    }

    /**
     * 不足している必須要件を取得
     * @return array 不足項目のキーと説明
     */
    public function getMissingRequirements(): array
    {
        $missing = [];

        // User の確認
        if (!$this->user_id) {
            $missing['user'] = 'ユーザーが選択されていません';
            return $missing;
        }

        $user = $this->user;
        if (!$user) {
            $missing['user'] = 'ユーザーが見つかりません';
            return $missing;
        }

        // User.Profile の確認
        $profile = $user->profile;
        if (!$profile) {
            $missing['profile'] = 'ユーザーのプロフィール情報が不足しています';
        } else {
            if (!$profile->first_name || !$profile->last_name) {
                $missing['profile_name'] = 'ユーザーの氏名が入力されていません';
            }
            if (!$profile->phone && !$profile->mobile) {
                $missing['profile_phone'] = 'ユーザーの連絡先が入力されていません';
            }
        }

        // Company の確認
        if (!$this->company_id) {
            $missing['company'] = '会社が選択されていません';
            return $missing;
        }

        $company = $this->company;
        if (!$company) {
            $missing['company'] = '会社が見つかりません';
            return $missing;
        }

        // Company の基本情報確認
        if (!$company->legal_name) {
            $missing['company_name'] = '会社名が入力されていません';
        }

        // Company.Address の確認
        $address = $company->addresses()->first();
        if (!$address) {
            $missing['company_address'] = '会社の住所が登録されていません';
        } else {
            if (!$address->postal_code || !$address->prefecture || !$address->city) {
                $missing['company_address_detail'] = '会社の住所情報が不完全です';
            }
        }

        // Quote の確認
        if (!$this->quote_id) {
            $missing['quote'] = '見積もりが選択されていません';
        } elseif (!$this->quote) {
            $missing['quote'] = '選択された見積もりが見つかりません';
        }

        return $missing;
    }

    /**
     * 署名を受け取れるかチェック
     */
    public function canReceiveSignature(): bool
    {
        // メールが送信されている（pending, sent などの状態）
        $hasBeenSent = $this->histories()
            ->where('action', 'sent')
            ->whereIn('status', ['pending', 'sent'])
            ->exists();

        // 全必須要件を満たしている
        return $this->canSend() && $hasBeenSent;
    }

    /**
     * ユーザー署名待ちかチェック
     */
    public function isAwaitingUserSignature(): bool
    {
        return in_array($this->signature_status, ['pending', 'user_signed']) &&
            in_array($this->signature_required_from, ['user', 'both']);
    }

    /**
     * 管理者署名待ちかチェック
     */
    public function isAwaitingAdminSignature(): bool
    {
        return in_array($this->signature_status, ['pending', 'user_signed', 'admin_signed']) &&
            in_array($this->signature_required_from, ['admin', 'both']);
    }

    /**
     * 完全に署名されているかチェック
     */
    public function isFullySigned(): bool
    {
        return $this->signature_status === 'fully_signed';
    }

    /**
     * 署名ステータスラベルを取得
     */
    public function getSignatureStatusLabel(): string
    {
        return match ($this->signature_status) {
            'pending' => '署名待ち',
            'user_signed' => 'ユーザー署名済み',
            'fully_signed' => '完全署名',
            'rejected' => '却下',
            default => $this->signature_status,
        };
    }

    /**
     * 最新の署名を取得
     */
    public function getLatestSignature($type = null)
    {
        $query = $this->signatures()->latest('created_at');

        if ($type) {
            $query->where('signature_type', $type);
        }

        return $query->first();
    }

    /**
     * 不足している必須要件を詳細に取得（UI表示用）
     * @return array ['has_errors' => bool, 'errors' => [message => string], 'warnings' => [message => string]]
     */
    public function getRequirementStatus(): array
    {
        $missing = $this->getMissingRequirements();

        $errors = [];
        $warnings = [];

        foreach ($missing as $key => $message) {
            $errors[] = $message;
        }

        return [
            'has_errors' => !empty($errors),
            'can_send' => $this->canSend(),
            'errors' => $errors,
            'warnings' => $warnings,
            'missing_requirements' => $missing,
        ];
    }
}
