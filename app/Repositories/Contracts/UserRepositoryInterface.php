<?php

namespace App\Repositories\Contracts;

use App\Models\User;

/**
 * ユーザーリポジトリインターフェース
 * 
 * SoftDeletableRepositoryInterfaceを継承し、User固有のメソッドを追加
 */
interface UserRepositoryInterface extends SoftDeletableRepositoryInterface
{
    /**
     * メールアドレスで検索
     * 
     * @param string $email
     * @return User|null
     */
    public function findByEmail(string $email): ?User;
}
