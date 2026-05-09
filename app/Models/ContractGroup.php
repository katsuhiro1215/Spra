<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContractGroup extends Model
{
    use HasUlid, SoftDeletes;

    protected $fillable = [
        'group_number',
        'quote_id',
        'user_id',
        'company_id',
        'title',
        'description',
        'status',
        'created_by',
    ];

    const STATUS_ACTIVE = 'active';
    const STATUS_PARTIALLY_ACTIVE = 'partially_active';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    public const STATUSES = [
        'active' => 'すべて有効',
        'partially_active' => '一部有効',
        'completed' => '完了',
        'cancelled' => 'キャンセル',
    ];

    // -------------------------
    // リレーション
    // -------------------------

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class)->orderBy('created_at');
    }

    public function activeContracts(): HasMany
    {
        return $this->hasMany(Contract::class)->where('status', 'active');
    }

    public function recurringContracts(): HasMany
    {
        return $this->hasMany(Contract::class)
            ->whereIn('type', ['monthly', 'annual']);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

  // -------------------------
  // ヘルパーメソッド
  // -------------------------

    /**
     * グループ番号を生成
     */
    public static function generateGroupNumber(): string
    {
        $year = date('Y');
        $lastGroup = self::whereYear('created_at', $year)
            ->orderBy('group_number', 'desc')
            ->first();

        if ($lastGroup && preg_match('/CG(\d{4})-(\d+)/', $lastGroup->group_number, $matches)) {
            $nextNumber = intval($matches[2]) + 1;
        } else {
            $nextNumber = 1;
        }

        return sprintf('CG%s-%03d', $year, $nextNumber);
    }

    /**
     * ステータスを更新（配下の契約状態から自動判定）
     */
    public function updateStatusFromContracts(): void
    {
        $contracts = $this->contracts;

        if ($contracts->isEmpty()) {
            $this->status = self::STATUS_CANCELLED;
        } elseif ($contracts->every(fn($c) => $c->status === 'completed')) {
            $this->status = self::STATUS_COMPLETED;
        } elseif ($contracts->every(fn($c) => $c->status === 'cancelled')) {
            $this->status = self::STATUS_CANCELLED;
        } elseif ($contracts->some(fn($c) => $c->status === 'active')) {
            if ($contracts->every(fn($c) => in_array($c->status, ['active', 'completed']))) {
                $this->status = self::STATUS_ACTIVE;
            } else {
                $this->status = self::STATUS_PARTIALLY_ACTIVE;
            }
        } else {
            $this->status = self::STATUS_PARTIALLY_ACTIVE;
        }

        $this->save();
    }
}
