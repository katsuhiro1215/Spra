<?php

namespace App\Repositories\Contracts;

/**
 * ヒアリングリポジトリインターフェース
 */
interface HearingRepositoryInterface extends SoftDeletableRepositoryInterface
{
    /**
     * Contactに関連するHearingを取得
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByContact(string $contactId);
}
