<?php

namespace App\Services;

use App\Models\Page;
use App\Models\PageType;
use App\Models\Section;
use App\Repositories\PageRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PageService extends BaseService
{
    /**
     * コンストラクタ
     */
    public function __construct(PageRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * エンティティ名を返す
     */
    protected function getEntityName(): string
    {
        return 'Page';
    }

    /**
     * 新しいページ作成
     *
     * @param array $data
     * @return Page
     */
    public function createPage(array $data): Page
    {
        return DB::transaction(function () use ($data) {
            // 作成者情報の追加
            $data['created_by'] = Auth::guard('admins')->id();

            $page = $this->repository->create($data);
            $this->createDefaultSections($page);

            return $page;
        });
    }

    /**
     * ページタイプのdefault_layoutに従って初期セクションを作成
     */
    private function createDefaultSections(Page $page): void
    {
        $pageType = PageType::find($page->page_type_id);
        $sections = $pageType?->default_layout['sections'] ?? [];

        if (empty($sections)) {
            return;
        }

        $adminId = Auth::guard('admins')->id();

        foreach ($sections as $index => $section) {
            Section::create([
                'page_id' => $page->id,
                'name' => $section['name'] ?? 'セクション',
                'role' => $section['role'] ?? 'main',
                'sort_order' => $index,
                'content' => ['blocks' => []],
                'created_by' => $adminId,
            ]);
        }
    }

    /**
     * ページを更新
     *
     * @param Page $page
     * @param array $data
     * @return Page
     */
    public function updatePage(Page $page, array $data): Page
    {
        return DB::transaction(function () use ($page, $data) {
            // 更新者情報の追加
            $data['updated_by'] = Auth::guard('admins')->id();

            return $this->repository->update($page, $data);
        });
    }

    /**
     * ページを削除
     */
    public function deletePage(Page $page): bool
    {
        return DB::transaction(function () use ($page) {
            return $this->repository->delete($page);
        });
    }

    /**
     * ページを復元
     */
    public function restorePage(Page $page): bool
    {
        return $this->repository->restore($page);
    }
}
