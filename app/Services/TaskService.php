<?php

namespace App\Services;

use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Support\Collection;

class TaskService extends BaseService
{
    public function __construct(TaskRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'Task';
    }

    public function createTask(array $data, string $creatorId): Task
    {
        $data['created_by'] = $creatorId;
        $data['status'] ??= 'todo';
        $data['priority'] ??= 'medium';

        return $this->repository->create($data);
    }

    public function updateStatus(Task $task, string $status): Task
    {
        $data = ['status' => $status];
        $data['completed_at'] = $status === 'done' ? now() : null;

        return $this->repository->update($task, $data);
    }

    public function getTodayForAdmin(string $adminId): Collection
    {
        return $this->repository->findTodayForAdmin($adminId);
    }

    public function getAssignedTo(string $adminId, int $limit = 10): Collection
    {
        return $this->repository->findAssignedTo($adminId, $limit);
    }

    public function getForBoard(array $filters): Collection
    {
        return $this->repository->findForBoard($filters);
    }
}
