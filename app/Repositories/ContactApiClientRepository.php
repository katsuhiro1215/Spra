<?php

namespace App\Repositories;

use App\Models\ContactApiClient;

class ContactApiClientRepository extends BaseRepository
{
    /**
     * モデルクラス名を返す
     *
     * @return string
     */
    protected function getModelClass(): string
    {
        return ContactApiClient::class;
    }

    /**
     * 検索対象フィールドを返す
     *
     * @return array
     */
    protected function getSearchableFields(): array
    {
        return ['name'];
    }

    /**
     * ソート可能フィールドを返す
     *
     * @return array
     */
    protected function getSortableFields(): array
    {
        return ['name', 'created_at', 'last_used_at', 'is_active'];
    }

    /**
     * APIキーのハッシュ値からクライアントを検索
     *
     * @param string $hash
     * @return ContactApiClient|null
     */
    public function findByKeyHash(string $hash): ?ContactApiClient
    {
        return ContactApiClient::where('api_key_hash', $hash)->first();
    }

    /**
     * 統計情報を取得
     *
     * @return array
     */
    public function getStats(): array
    {
        return [
            'total' => ContactApiClient::count(),
            'active' => ContactApiClient::where('is_active', true)->count(),
            'inactive' => ContactApiClient::where('is_active', false)->count(),
        ];
    }
}
