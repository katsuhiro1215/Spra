<?php

namespace App\Services;

use App\Models\OrganizationHistory;
use App\Repositories\OrganizationHistoryRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrganizationHistoryService extends BaseService
{
  public function __construct(OrganizationHistoryRepository $repository)
  {
    parent::__construct($repository);
  }

  protected function getEntityName(): string
  {
    return 'OrganizationHistory';
  }

  public function createHistory(array $data): OrganizationHistory
  {
    return DB::transaction(function () use ($data) {
      $data['created_by'] = Auth::guard('admins')->id();
      return $this->repository->create($data);
    });
  }

  public function updateHistory(OrganizationHistory $history, array $data): OrganizationHistory
  {
    return DB::transaction(function () use ($history, $data) {
      $data['updated_by'] = Auth::guard('admins')->id();
      return $this->repository->update($history, $data);
    });
  }

  public function deleteHistory(OrganizationHistory $history): bool
  {
    return $this->repository->delete($history);
  }
}
