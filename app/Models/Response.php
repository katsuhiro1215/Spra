<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Response extends Model
{
    use HasUlid, SoftDeletes;

    const STATUS_DRAFT = 'draft';
    const STATUS_SENT = 'sent';

    protected $fillable = [
        'contact_id',
        'response_template_id',
        'admin_id',
        'subject',
        'body',
        'status',
        'sent_at',
        'recipient_email',
        'recipient_name',
        'send_error',
        'created_by',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
    ];

    // -------------------------
    // リレーション
    // -------------------------

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function responseTemplate(): BelongsTo
    {
        return $this->belongsTo(ResponseTemplate::class);
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    // -------------------------
    // ヘルパーメソッド
    // -------------------------

    /**
     * 下書きかどうか
     */
    public function isDraft(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    /**
     * 送信済みかどうか
     */
    public function isSent(): bool
    {
        return $this->status === self::STATUS_SENT;
    }

    /**
     * 送信済みにマーク
     */
    public function markAsSent(): void
    {
        $this->update([
            'status' => self::STATUS_SENT,
            'sent_at' => now(),
        ]);
    }

    /**
     * 送信エラーを記録
     */
    public function recordSendError(string $error): void
    {
        $this->update([
            'send_error' => $error,
        ]);
    }

    /**
     * プレースホルダーを実際の値に置換
     */
    public function replacePlaceholders(string $text): string
    {
        $contact = $this->contact;

        $replacements = [
            '{contact_name}' => $contact->name,
            '{contact_email}' => $contact->email,
            '{contact_company}' => $contact->company ?? '',
            '{contact_phone}' => $contact->phone ?? '',
            '{contact_subject}' => $contact->subject,
            '{contact_message}' => $contact->message,
            '{admin_name}' => $this->admin->profile->full_name ?? $this->admin->email,
            '{today}' => now()->format('Y年m月d日'),
            '{app_name}' => config('app.name'),
        ];

        return str_replace(array_keys($replacements), array_values($replacements), $text);
    }

    /**
     * スコープ: 送信済みのみ
     */
    public function scopeSent($query)
    {
        return $query->where('status', self::STATUS_SENT);
    }

    /**
     * スコープ: 下書きのみ
     */
    public function scopeDraft($query)
    {
        return $query->where('status', self::STATUS_DRAFT);
    }
}
