<?php

namespace App\Repositories;

use App\Models\Response;
use App\Repositories\Contracts\ResponseRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class ResponseRepository extends SoftDeletableRepository implements ResponseRepositoryInterface
{
    /**
     * モデルクラス名を返す
     * 
     * @return string
     */
    protected function getModelClass(): string
    {
        return Response::class;
    }

    /**
     * 検索対象フィールドを返す
     * 
     * @return array
     */
    protected function getSearchableFields(): array
    {
        return [
            'subject',
            'body',
            'recipient_email',
            'recipient_name',
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
            'sent_at',
            'status',
        ];
    }

    /**
     * デフォルトのリレーションを返す
     * 
     * @return array
     */
    protected function getDefaultRelations(): array
    {
        return ['contact', 'admin', 'responseTemplate', 'creator'];
    }

    /**
     * Contactに関連するResponseを取得
     * 
     * @param string $contactId
     * @return Collection
     */
    public function getByContact(string $contactId): Collection
    {
        return Response::where('contact_id', $contactId)
            ->with($this->getDefaultRelations())
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * 管理者が作成したResponseを取得
     * 
     * @param string $adminId
     * @return Collection
     */
    public function getByAdmin(string $adminId): Collection
    {
        return Response::where('admin_id', $adminId)
            ->with($this->getDefaultRelations())
            ->orderBy('created_at', 'desc')
            ->get();
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

        // Contactフィルター
        if (!empty($filters['contact_id'])) {
            $query->where('contact_id', $filters['contact_id']);
        }

        // Adminフィルター
        if (!empty($filters['admin_id'])) {
            $query->where('admin_id', $filters['admin_id']);
        }

        // テンプレートフィルター
        if (!empty($filters['response_template_id'])) {
            $query->where('response_template_id', $filters['response_template_id']);
        }

        return $query;
    }
}
