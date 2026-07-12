<?php

namespace App\Repositories;

use App\Models\Contact;
use App\Repositories\Contracts\ContactRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class ContactRepository extends BaseRepository implements ContactRepositoryInterface
{
    /**
     * モデルクラス名を返す
     *
     * @return string
     */
    protected function getModelClass(): string
    {
        return Contact::class;
    }

    /**
     * 検索対象フィールドを返す
     *
     * @return array
     */
    protected function getSearchableFields(): array
    {
        return [
            'name',
            'email',
            'company',
            'subject',
            'message',
        ];
    }

    /**
     * ソート可能フィールドを返す
     *
     * @return array
     */
    protected function getSortableFields(): array
    {
        return [
            'created_at',
            'updated_at',
            'status',
            'source',
            'contact_category_id',
        ];
    }

    /**
     * デフォルトのリレーションを返す
     *
     * @return array
     */
    protected function getDefaultRelations(): array
    {
        return ['assignedAdmin', 'contactCategory'];
    }

    /**
     * メールアドレスで検索
     *
     * @param string $email
     * @return Contact|null
     */
    public function findByEmail(string $email): ?Contact
    {
        return $this->query()->where('email', $email)->first();
    }

    /**
     * 未読お問い合わせ件数を取得
     *
     * @return int
     */
    public function getUnreadCount(): int
    {
        return Contact::where('status', 'new')->count();
    }

    /**
     * フィルタ条件でクエリビルダーを取得（オーバーライド）
     *
     * @param array $filters
     * @return Builder
     */
    public function findWithFilters(array $filters): Builder
    {
        // 親クラスの基本フィルタを適用
        $query = parent::findWithFilters($filters);

        // カテゴリフィルター
        if (!empty($filters['category'])) {
            $query->where('contact_category_id', $filters['category']);
        }

        // ソースフィルター
        if (!empty($filters['source'])) {
            $query->where('source', $filters['source']);
        }

        // 割り当て担当者フィルター
        if (!empty($filters['assigned_to'])) {
            $query->where('assigned_to', $filters['assigned_to']);
        }

        return $query;
    }

    /**
     * お問い合わせの統計情報を取得
     *
     * @return array
     */
    public function getStats(): array
    {
        $modelClass = $this->getModelClass();

        return [
            'total' => $modelClass::count(),
            'new' => $modelClass::where('status', 'new')->count(),
            'in_progress' => $modelClass::where('status', 'in_progress')->count(),
            'replied' => $modelClass::where('status', 'replied')->count(),
            'resolved' => $modelClass::where('status', 'resolved')->count(),
            'recent' => $modelClass::where('created_at', '>=', now()->subDays(7))->count(),
        ];
    }

    /**
     * 複数のお問い合わせを一括更新
     *
     * @param array $ids
     * @param array $data
     * @return int
     */
    public function updateBulk(array $ids, array $data): int
    {
        return Contact::whereIn('id', $ids)->update($data);
    }

    /**
     * ステータスが返信済み、解決済み、クローズの場合は responded_at を自動設定
     *
     * @param Contact $contact
     * @param array $data
     * @return void
     */
    public function setResponseDateIfNeeded(Contact &$contact, array &$data): void
    {
        if (
            in_array($data['status'] ?? null, ['replied', 'resolved', 'closed'])
            && !$contact->responded_at
        ) {
            $data['responded_at'] = now();
        }
    }
}
