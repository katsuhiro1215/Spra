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
        ];
    }

    /**
     * メールアドレスで検索
     * 
     * @param string $email
     * @return Contact|null
     */
    public function findByEmail(string $email): ?Contact
    {
        return Contact::where('email', $email)->first();
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

        // ソースフィルター
        if (!empty($filters['source'])) {
            $query->where('source', $filters['source']);
        }

        return $query;
    }
}
