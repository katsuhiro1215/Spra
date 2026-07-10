<?php

namespace App\Repositories\Contracts;

use App\Models\ProjectTemplate;

/**
 * プロジェクトテンプレートリポジトリインターフェース
 * 
 * SoftDeletableRepositoryInterfaceを継承し、ProjectTemplate固有のメソッドを追加
 */
interface ProjectTemplateRepositoryInterface extends SoftDeletableRepositoryInterface
{
    // 
}
