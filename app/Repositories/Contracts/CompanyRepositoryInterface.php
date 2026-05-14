<?php

namespace App\Repositories\Contracts;

use App\Models\Company;

/**
 * 会社リポジトリインターフェース
 * 
 * SoftDeletableRepositoryInterfaceを継承し、Company固有のメソッドを追加
 */
interface CompanyRepositoryInterface extends SoftDeletableRepositoryInterface
{
    /**
     * メールアドレスで検索
     * 
     * @param string $email
     * @return Company|null
     */
    public function findByEmail(string $email): ?Company;
}
