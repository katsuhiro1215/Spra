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

    /**
     * お問い合わせの統計情報を取得
     *
     * @return array
     */
    public function getStats(): array;

    /**
     * 複数のお問い合わせを一括更新
     *
     * @param array $ids
     * @param array $data
     * @return int
     */
    public function updateBulk(array $ids, array $data): int;

    /**
     * ステータスが返信済み、解決済み、クローズの場合は responded_at を自動設定
     *
     * @param Contact $contact
     * @param array $data
     * @return void
     */
    public function setResponseDateIfNeeded(Contact &$contact, array &$data): void;
}
