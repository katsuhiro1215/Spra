<?php

namespace App\Repositories\Contracts;

use App\Models\Response;

/**
 * レスポンスリポジトリインターフェース
 * 
 * SoftDeletableRepositoryInterfaceを継承し、Response固有のメソッドを追加
 */
interface ResponseRepositoryInterface extends SoftDeletableRepositoryInterface
{
    /**
     * Contactに関連するResponseを取得
     * 
     * @param string $contactId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByContact(string $contactId);

    /**
     * 管理者が作成したResponseを取得
     * 
     * @param string $adminId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByAdmin(string $adminId);
}
