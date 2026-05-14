<?php

namespace App\Repositories\Contracts;

use App\Models\Contact;

/**
 * お問い合わせリポジトリインターフェース
 * 
 * BaseRepositoryInterfaceを継承し、Contact固有のメソッドを追加
 */
interface ContactRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * メールアドレスで検索
     * 
     * @param string $email
     * @return Contact|null
     */
    public function findByEmail(string $email): ?Contact;

    /**
     * 未読お問い合わせ件数を取得
     * 
     * @return int
     */
    public function getUnreadCount(): int;
}
