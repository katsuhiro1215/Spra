<?php

namespace App\Services;

use App\Models\Section;
use App\Repositories\SectionRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SectionService extends BaseService
{
  public function __construct(SectionRepository $repository)
  {
    parent::__construct($repository);
  }

  protected function getEntityName(): string
  {
    return 'Section';
  }

  public function createSection(array $data): Section
  {
    return DB::transaction(function () use ($data) {
      $data['created_by'] = Auth::guard('admins')->id();
      return $this->repository->create($data);
    });
  }

  public function updateSection(Section $section, array $data): Section
  {
    return DB::transaction(function () use ($section, $data) {
      $data['updated_by'] = Auth::guard('admins')->id();
      return $this->repository->update($section, $data);
    });
  }

  public function deleteSection(Section $section): bool
  {
    return DB::transaction(function () use ($section) {
      return $this->repository->delete($section);
    });
  }

  public function restoreSection(Section $section): bool
  {
    return $this->repository->restore($section);
  }

  /**
   * セクションの並び順を一括更新
   */
  public function reorderSections(array $sectionIds): void
  {
    DB::transaction(function () use ($sectionIds) {
      foreach ($sectionIds as $index => $id) {
        Section::whereKey($id)->update(['sort_order' => $index]);
      }
    });
  }
}
