<?php

namespace App\Http\Controllers\Admin\Contact;

use App\Http\Controllers\Controller;
use App\Models\ContactCategory;
use App\Services\ContactCategoryService;
use App\Http\Requests\ContactCategoryRequest;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * ContactCategory 管理コントローラー
 */
class ContactCategoryController extends Controller
{
    public function __construct(
        private ContactCategoryService $service
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'is_active']);
        $sort = [
            'field' => $request->get('sort_field', 'sort_order'),
            'direction' => $request->get('sort_direction', 'asc'),
        ];

        $categories = $this->service->getPaginated($filters, $sort, 20);
        $stats = $this->service->getStats();

        return Inertia::render('Admin/Contact/Category/Index', [
            'categories' => $categories,
            'stats' => $stats,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Contact/Category/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ContactCategoryRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());

        return redirect()
            ->route('admin.contact.category.index')
            ->with('message', 'カテゴリが正常に作成されました。');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id): Response
    {
        $category = $this->service->findById($id);

        return Inertia::render('Admin/Contact/Category/Edit', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ContactCategoryRequest $request, string $id): RedirectResponse
    {
        $this->service->update($id, $request->validated());

        return redirect()
            ->route('admin.contact.category.index')
            ->with('message', 'カテゴリが正常に更新されました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        $category = $this->service->findById($id);

        if (!$category) {
            return redirect()
                ->route('admin.contact.category.index')
                ->with('error', 'カテゴリが見つかりません。');
        }

        // 関連するコンタクトがあるかチェック
        if ($category->contacts()->count() > 0) {
            return redirect()
                ->route('admin.contact.category.index')
                ->with('error', '関連するお問い合わせが存在するため、削除できません。');
        }

        $this->service->delete($category);

        return redirect()
            ->route('admin.contact.category.index')
            ->with('message', 'カテゴリが正常に削除されました。');
    }
}
