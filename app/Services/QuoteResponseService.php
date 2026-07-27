<?php

namespace App\Services;

use App\Models\QuoteResponse;
use App\Repositories\QuoteResponseRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class QuoteResponseService extends BaseService
{
    /**
     * コンストラクタ
     *
     * @param QuoteResponseRepository $repository
     */
    public function __construct(QuoteResponseRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * エンティティ名を返す
     *
     * @return string
     */
    protected function getEntityName(): string
    {
        return 'QuoteResponse';
    }

    /**
     * ページネーション付きで取得
     *
     * @param array $filters
     * @param array $sort
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginated(array $filters = [], array $sort = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = $this->repository->getQuery();

        // フィルター適用
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('email', 'like', "%{$search}%")
                    ->orWhereHas('quote', function ($q) use ($search) {
                        $q->where('quote_number', 'like', "%{$search}%");
                    });
            });
        }

        // ステータスフィルター
        if (!empty($filters['status'])) {
            $status = $filters['status'];
            if ($status === 'pending') {
                $query->whereNull('responded_at');
            } elseif ($status === 'responded') {
                $query->whereNotNull('responded_at');
            }
        }

        // レスポンスタイプフィルター
        if (!empty($filters['response_type'])) {
            $query->where('response_type', $filters['response_type']);
        }

        // ソート設定
        $sortField = $sort['field'] ?? 'created_at';
        $sortDirection = $sort['direction'] ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        // リレーション読み込み
        $query->with(['quote', 'quote.contact', 'user', 'company']);

        return $query->paginate($perPage);
    }

    /**
     * トークンから返信を取得
     *
     * @param string $token
     * @return QuoteResponse|null
     */
    public function findByToken(string $token): ?QuoteResponse
    {
        return $this->repository->getQuery()
            ->where('token', $token)
            ->with(['quote', 'quote.contact'])
            ->first();
    }

    /**
     * 招待メールを送信（自動送信・管理者による手動送信/再送信の両方から呼ばれる）
     *
     * @param QuoteResponse $quoteResponse
     * @return void
     */
    public function sendInvitationEmail(QuoteResponse $quoteResponse): void
    {
        Mail::to($quoteResponse->email)->send(
            new \App\Mail\SendQuoteResponseInvitationMail($quoteResponse)
        );

        $quoteResponse->update(['invitation_sent_at' => now()]);
    }

    /**
     * 管理者が内容を確認したことを記録する
     *
     * @param QuoteResponse $quoteResponse
     * @param string $adminId
     * @return QuoteResponse
     */
    public function markReviewed(QuoteResponse $quoteResponse, string $adminId): QuoteResponse
    {
        $quoteResponse->update([
            'admin_reviewed_at' => now(),
            'reviewed_by_admin_id' => $adminId,
        ]);

        return $quoteResponse->fresh();
    }

    /**
     * ユーザーと会社を登録
     *
     * @param QuoteResponse $quoteResponse
     * @param array $data
     * @return \App\Models\User
     */
    public function registerUserAndCompany(QuoteResponse $quoteResponse, array $data)
    {
        return DB::transaction(function () use ($quoteResponse, $data) {
            // ユーザー作成
            $user = new \App\Models\User([
                'email' => $quoteResponse->email,
                'password' => bcrypt($data['password']),
                'status' => 'active',
            ]);
            $user->save();

            // 会社作成
            $company = new \App\Models\Company($data['company_data']);
            $company->save();

            // QuoteResponse に関連付け
            $quoteResponse->update([
                'user_id' => $user->id,
                'company_id' => $company->id,
                'admin_notified_at' => now(),
            ]);

            // 対応する Quote も更新（user_id と company_id を同期）
            if ($quoteResponse->quote_id) {
                $quoteResponse->quote()->update([
                    'user_id' => $user->id,
                    'company_id' => $company->id,
                ]);
            }

            return $user;
        });
    }

    /**
     * 返信を取得（詳細表示用）
     *
     * @param string $id
     * @return QuoteResponse
     */
    public function getDetail(string $id): QuoteResponse
    {
        return $this->repository->getQuery()
            ->with(['quote.contact', 'quote.currentVersion', 'user', 'company', 'reviewedByAdmin'])
            ->findOrFail($id);
    }

    /**
     * 長期間クライアントからの回答がない見積を、管理者が目視確認のうえ
     * 手動で「見送り(NG)」として記録する。自動処理は行わない。
     *
     * @param QuoteResponse $quoteResponse
     * @param string $adminId
     * @param string|null $note
     * @return QuoteResponse
     * @throws \Exception
     */
    public function markAsDeclined(QuoteResponse $quoteResponse, string $adminId, ?string $note = null): QuoteResponse
    {
        if (!$quoteResponse->isPending()) {
            throw new \Exception('既に回答済みの見積には手動判定を行えません。');
        }

        $quoteResponse->update([
            'response_type' => 'decline',
            'response_text' => $note,
            'responded_at' => now(),
            'admin_notified_at' => now(),
            'decided_by_admin_id' => $adminId,
        ]);

        $this->logInfo('marked_declined', $quoteResponse->id, ['admin_id' => $adminId]);

        return $quoteResponse->fresh();
    }
}
