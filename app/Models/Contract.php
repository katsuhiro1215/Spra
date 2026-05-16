<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Contract extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'contract_number',
        'contract_group_id',
        'parent_contract_id',
        'quote_id',
        'user_id',
        'company_id',
        'service_id',
        'service_plan_id',
        'title',
        'description',
        'type',
        'amount',
        'tax_rate',
        'start_date',
        'end_date',
        'status',
        'signed_at',
        'terminated_at',
        'termination_reason',
        'auto_renewal',
        'renewal_notice_days',
        'terms_and_conditions',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'start_date'    => 'date',
        'end_date'      => 'date',
        'signed_at'     => 'datetime',
        'terminated_at' => 'datetime',
        'amount'        => 'decimal:2',
        'tax_rate'      => 'decimal:2',
        'auto_renewal'  => 'boolean',
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

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function servicePlan(): BelongsTo
    {
        return $this->belongsTo(ServicePlan::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ContractDocument::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
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
}
