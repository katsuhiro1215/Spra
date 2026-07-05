<?php

namespace App\Services;

use App\Models\ProjectTemplate;
use App\Repositories\ProjectTemplateRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class ProjectTemplateService extends BaseService
{
    /**
     * コンストラクタ
     * 
     * @param ProjectTemplateRepository $repository
     */
    public function __construct(
        ProjectTemplateRepository $repository
    ) {
        parent::__construct($repository);
    }

    /**
     * エンティティ名を返す（単数形）
     * 
     * @return string
     */
    protected function getEntityName(): string
    {
        return 'ProjectTemplate';
    }

    /**
     * Get all active templates
     */
    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->repository->getActive();
    }

    /**
     * Find template by ID with milestones
     */
    public function findById(string $id): ?ProjectTemplate
    {
        return $this->repository->findWithMilestones($id);
    }

    /**
     * Create new template
     */
    public function create(array $data): mixed
    {
        $template = parent::create($data);

        // Create milestones if provided
        if (isset($data['milestones']) && is_array($data['milestones'])) {
            foreach ($data['milestones'] as $milestoneData) {
                $template->milestones()->create($milestoneData);
            }
        }

        return $template;
    }

    /**
     * Update template
     */
    public function update(mixed $model, array $data): mixed
    {
        $template = parent::update($model, $data);

        // Update milestones if provided
        if (isset($data['milestones']) && is_array($data['milestones'])) {
            $template->milestones()->delete();
            foreach ($data['milestones'] as $milestoneData) {
                $template->milestones()->create($milestoneData);
            }
        }

        return $template;
    }

    /**
     * Delete template
     */
    public function delete(mixed $model): bool
    {
        return parent::delete($model);
    }

    /**
     * Get statistics
     */
    public function getStats(array $filters = []): array
    {
        return parent::getStats();
    }
}
