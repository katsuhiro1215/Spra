<?php

namespace App\Services;

use App\Models\Voice;
use App\Repositories\VoiceRepository;
use Illuminate\Support\Facades\DB;

class VoiceService extends BaseService
{
    public function __construct(VoiceRepository $repository)
    {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'Voice';
    }

    public function deleteVoice(Voice $voice): bool
    {
        return $this->repository->delete($voice);
    }

    public function restoreVoice(Voice $voice): bool
    {
        return $this->repository->restore($voice);
    }

    public function changeStatus(Voice $voice, bool $isPublished): Voice
    {
        return $this->repository->update($voice, ['is_published' => $isPublished]);
    }

    /**
     * 一括操作
     */
    public function bulkAction(array $ids, string $action): int
    {
        return DB::transaction(function () use ($ids, $action) {
            $query = Voice::whereIn('id', $ids);

            return match ($action) {
                'publish' => $query->update(['is_published' => true]),
                'unpublish' => $query->update(['is_published' => false]),
                'delete' => $query->get()->each->delete()->count(),
                default => 0,
            };
        });
    }
}
