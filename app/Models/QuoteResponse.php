<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class QuoteResponse extends Model
{
    use HasUlid;

    protected $fillable = [
        'quote_id',
        'token',
        'email',
        'response_type',
        'response_text',
        'responded_at',
        'admin_notified_at',
        'decided_by_admin_id',
        'user_id',
        'company_id',
        'invitation_sent_at',
        'admin_reviewed_at',
        'reviewed_by_admin_id',
    ];

    protected $casts = [
        'responded_at' => 'datetime',
        'admin_notified_at' => 'datetime',
        'invitation_sent_at' => 'datetime',
        'admin_reviewed_at' => 'datetime',
    ];

    // Response types
    public const RESPONSE_TYPES = [
        'request' => 'ご依頼をお願いします',
        'decline' => '今回は見送ります。',
        'revision_request' => 'お見積りの見直しを依頼',
        'other' => 'その他',
    ];

    /**
     * Get the quote that this response belongs to.
     */
    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    /**
     * Get the user created from this response
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the company created from this response
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * この回答を手動でNG判定した管理者
     */
    public function decidedByAdmin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'decided_by_admin_id');
    }

    /**
     * この回答の内容を確認した管理者
     */
    public function reviewedByAdmin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'reviewed_by_admin_id');
    }

    /**
     * Create User and Company from onboarding form data
     *
     * @param array $validated Validated form data
     * @return array [$user, $company]
     */
    public function createUserAndCompany(array $validated)
    {
        return DB::transaction(function () use ($validated) {
            // ユーザー作成
            $user = User::create([
                'email' => $validated['email'],
                'password' => bcrypt($validated['password']),
                'status' => 'active',
            ]);

            // ユーザープロフィール作成
            $user->profile()->create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
            ]);

            // 会社作成
            $company = Company::create([
                'name' => $validated['company_name'],
                'type' => $validated['company_type'] ?? 'corporate',
                'phone' => $validated['company_phone'],
                'legal_name' => $validated['legal_name'],
                'representative_name' => $validated['representative_name'],
                'representative_email' => $validated['representative_email'],
                'representative_phone' => $validated['representative_phone'],
                'status' => 'active',
            ]);

            // ユーザーと会社を関連付け（primary）
            $user->companies()->attach($company->id, [
                'role' => 'admin',
                'is_primary' => true,
                'joined_at' => now(),
            ]);

            // QuoteResponse に関連付け
            $this->update([
                'user_id' => $user->id,
                'company_id' => $company->id,
                'admin_notified_at' => now(),
            ]);

            // 対応する Quote の user_id と company_id を同期
            if ($this->quote_id) {
                $this->quote()->update([
                    'user_id' => $user->id,
                    'company_id' => $company->id,
                ]);
            }

            return [$user, $company];
        });
    }

    /**
     * Get human-readable response type label
     */
    public function getResponseTypeLabel(): string
    {
        return self::RESPONSE_TYPES[$this->response_type] ?? $this->response_type;
    }

    /**
     * Check if response is pending
     */
    public function isPending(): bool
    {
        return $this->responded_at === null;
    }

    /**
     * Check if admin has been notified
     */
    public function isAdminNotified(): bool
    {
        return $this->admin_notified_at !== null;
    }

    /**
     * 招待メール送信済みかどうか（自動送信・手動送信を問わない）
     */
    public function isInvitationSent(): bool
    {
        return $this->invitation_sent_at !== null;
    }

    /**
     * 管理者が内容を確認済みかどうか
     */
    public function isReviewed(): bool
    {
        return $this->admin_reviewed_at !== null;
    }
}
