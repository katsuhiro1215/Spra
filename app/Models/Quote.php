<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Quote extends Model
{
    use HasUlid, SoftDeletes;

    const STATUS_DRAFT = 'draft';
    const STATUS_SENT = 'sent';
    const STATUS_REVIEWED = 'reviewed';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_EXPIRED = 'expired';

    protected $fillable = [
        'quote_number',
        'user_id',
        'contact_id',
        'company_id',
        'title',
        'requirements',
        'custom_specifications',
        'base_amount',
        'discount_amount',
        'tax_rate',
        'tax_amount',
        'total_amount',
        'status',
        'client_feedback',
        'sent_at',
        'responded_at',
        'expires_at',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'base_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_rate' => 'integer',
        'tax_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'sent_at' => 'datetime',
        'responded_at' => 'datetime',
        'expires_at' => 'datetime',
        'custom_specifications' => 'json',
    ];

    // -------------------------
    // リレーション
    // -------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(QuoteItem::class)->orderBy('sort_order');
    }

    public function contractGroup(): HasOne
    {
        return $this->hasOne(ContractGroup::class);
    }

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

  // -------------------------
  // ヘルパーメソッド
  // -------------------------

    /**
     * 連絡先情報を取得（UserまたはContactから）
     *
     * @return array{name: string|null, email: string|null, phone: string|null, company: string|null}
     */
    public function getContactInfo(): array
    {
        if ($this->user_id && $this->user) {
            return [
                'name' => $this->user->profile->name ?? null,
                'email' => $this->user->email,
                'phone' => $this->user->profile->phone ?? null,
                'company' => $this->company->name ?? null,
            ];
        }

        if ($this->contact_id && $this->contact) {
            return [
                'name' => $this->contact->name,
                'email' => $this->contact->email,
                'phone' => $this->contact->phone,
                'company' => $this->contact->company,
            ];
        }

        return [
            'name' => null,
            'email' => null,
            'phone' => null,
            'company' => null,
        ];
    }

    /**
     * 連絡先が存在するかチェック
     */
    public function hasContactInfo(): bool
    {
        return $this->user_id || $this->contact_id;
    }

    /**
     * 見積に含まれる全サービスを取得
     */
    public function getServices(): Collection
    {
        return $this->items()
            ->with('service')
            ->whereNotNull('service_id')
            ->get()
            ->pluck('service')
            ->unique('id');
    }

    /**
     * 契約タイプ別の明細を取得
     */
    public function getItemsByBillingType(string $billingType): Collection
    {
        return $this->items()
            ->where('billing_type', $billingType)
            ->get();
    }

    public function isDraft(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    public function isSent(): bool
    {
        return $this->status === self::STATUS_SENT;
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    public function isExpired(): bool
    {
        return $this->status === self::STATUS_EXPIRED ||
            ($this->expires_at && $this->expires_at->isPast() && !$this->isApproved());
    }

    /**
     * 見積番号を生成
     */
    public static function generateQuoteNumber(): string
    {
        $year = date('Y');
        $lastQuote = self::whereYear('created_at', $year)
            ->orderBy('quote_number', 'desc')
            ->first();

        if ($lastQuote && preg_match('/Q(\d{4})-(\d+)/', $lastQuote->quote_number, $matches)) {
            $nextNumber = intval($matches[2]) + 1;
        } else {
            $nextNumber = 1;
        }

        return sprintf('Q%s-%03d', $year, $nextNumber);
    }
}
