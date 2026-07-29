<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface ProjectFileRepositoryInterface extends BaseRepositoryInterface
{
    public function getForProject(string $projectId): Collection;
}
