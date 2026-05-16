<?php

namespace App\Repositories\Contracts;

/**
 * サービスアイテムリポジトリインターフェース
 * 
 * SoftDeletableRepositoryInterfaceを継承し、ServiceItem固有のメソッドを追加
 */
interface ServiceItemRepositoryInterface extends SoftDeletableRepositoryInterface
{
    // ServiceItem固有のメソッドがあればここに追加
}
