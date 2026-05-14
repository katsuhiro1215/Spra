<?php

namespace App\Repositories\Contracts;

use App\Models\ServiceCategory;
use Illuminate\Database\Eloquent\Builder;

/**
 * サービスカテゴリリポジトリインターフェース
 * 
 * SoftDeletableRepositoryInterfaceを継承し、ServiceCategory固有のメソッドを追加
 */
interface ServiceCategoryRepositoryInterface extends SoftDeletableRepositoryInterface
{
    // 
}
