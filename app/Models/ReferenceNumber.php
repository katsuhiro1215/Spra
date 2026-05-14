<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * 参照番号管理モデル
 *
 * 各エンティティに対して人間が読みやすい一意の参照番号を管理
 * 例: PRJ-202605-0001
 */
class ReferenceNumber extends Model
{
    use HasUlid, SoftDeletes;

    /**
     * プレフィックス定数
     */
    const PREFIX_LEAD = 'LED';           // 見込み顧客
    const PREFIX_CONTRACT = 'CTR';       // 契約
    const PREFIX_PROJECT = 'PRJ';        // プロジェクト
    const PREFIX_INVOICE = 'INV';        // 請求書
    const PREFIX_RECEIPT = 'RCT';        // 領収書
    const PREFIX_MAINTENANCE = 'MNT';    // メンテナンス
    const PREFIX_SUBSCRIPTION = 'SUB';   // サブスクリプション
    const PREFIX_PROPOSAL = 'PRP';       // 提案書
    const PREFIX_QUOTE = 'QTE';          // 見積書

    /**
     * 利用可能なプレフィックス一覧
     */
    const PREFIXES = [
        self::PREFIX_LEAD => 'Lead',
        self::PREFIX_CONTRACT => 'Contract',
        self::PREFIX_PROJECT => 'Project',
        self::PREFIX_INVOICE => 'Invoice',
        self::PREFIX_RECEIPT => 'Receipt',
        self::PREFIX_MAINTENANCE => 'Maintenance',
        self::PREFIX_SUBSCRIPTION => 'Subscription',
        self::PREFIX_PROPOSAL => 'Proposal',
        self::PREFIX_QUOTE => 'Quote',
    ];

    protected $fillable = [
        'prefix',
        'year_month',
        'sequence',
        'reference_number',
        'entity_type',
        'entity_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * 関連エンティティへのポリモーフィックリレーション
     */
    public function entity(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * アクティブな参照番号のスコープ
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * プレフィックスでフィルタリング
     */
    public function scopeByPrefix($query, string $prefix)
    {
        return $query->where('prefix', $prefix);
    }

    /**
     * エンティティタイプでフィルタリング
     */
    public function scopeByEntityType($query, string $entityType)
    {
        return $query->where('entity_type', $entityType);
    }

    /**
     * 年月でフィルタリング
     */
    public function scopeByYearMonth($query, string $yearMonth)
    {
        return $query->where('year_month', $yearMonth);
    }

    /**
     * 参照番号を無効化
     *
     * @return bool
     */
    public function deactivate(): bool
    {
        $this->is_active = false;
        return $this->save();
    }

    /**
     * 参照番号を再アクティブ化
     *
     * @return bool
     */
    public function activate(): bool
    {
        $this->is_active = true;
        return $this->save();
    }

    /**
     * プレフィックスの日本語名を取得
     *
     * @return string
     */
    public function getPrefixLabelAttribute(): string
    {
        $labels = [
            self::PREFIX_LEAD => '見込み顧客',
            self::PREFIX_CONTRACT => '契約',
            self::PREFIX_PROJECT => 'プロジェクト',
            self::PREFIX_INVOICE => '請求書',
            self::PREFIX_RECEIPT => '領収書',
            self::PREFIX_MAINTENANCE => 'メンテナンス',
            self::PREFIX_SUBSCRIPTION => 'サブスクリプション',
            self::PREFIX_PROPOSAL => '提案書',
            self::PREFIX_QUOTE => '見積書',
        ];

        return $labels[$this->prefix] ?? $this->prefix;
    }
}
