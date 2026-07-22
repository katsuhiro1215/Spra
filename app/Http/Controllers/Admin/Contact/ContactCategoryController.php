<?php

namespace App\Http\Controllers\Admin\Contact;

use App\Http\Controllers\Controller;
use App\Models\ContactCategory;
use App\Services\ContactCategoryService;
use App\Http\Requests\ContactCategoryRequest;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

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

        return Inertia::render('Admin/ContactCategories/Index', [
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
        return Inertia::render('Admin/ContactCategories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ContactCategoryRequest $request): RedirectResponse
    {
        try {
            $this->service->create($request->validated());

            return redirect()
                ->route('admin.contact.category.index')
                ->with('success', __('messages.created', ['attribute' => 'お問い合わせカテゴリ']));
        } catch (\Exception $e) {
            Log::error('ContactCategory store error: ' . $e->getMessage());
            return redirect()
                ->route('admin.contact.category.index')
                ->with('error', __('messages.create_failed', ['attribute' => 'お問い合わせカテゴリ']));
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id): Response
    {
        $category = $this->service->findById($id);

        return Inertia::render('Admin/ContactCategories/Edit', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ContactCategoryRequest $request, string $id): RedirectResponse
    {
        try {
            $this->service->update($id, $request->validated());

            return redirect()
                ->route('admin.contact.category.index')
                ->with('success', __('messages.updated', ['attribute' => 'お問い合わせカテゴリ']));
        } catch (\Exception $e) {
            Log::error('ContactCategory update error: ' . $e->getMessage());
            return redirect()
                ->route('admin.contact.category.index')
                ->with('error', __('messages.update_failed', ['attribute' => 'お問い合わせカテゴリ']));
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ContactCategory $category): RedirectResponse
    {
        // 関連するコンタクトがあるかチェック
        if ($category->contacts()->exists()) {
            return redirect()
                ->route('admin.contact.category.index')
                ->with('error', __('messages.contact.has_related'));
        }
        // 削除処理

        try {
            $this->service->delete($category);

            return redirect()->route('admin.contact.category.index')
                ->with('success', __('messages.deleted', ['attribute' => 'お問い合わせカテゴリ']));
        } catch (\Exception $e) {
            Log::error('ContactCategory delete error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', __('messages.delete_failed', ['attribute' => 'お問い合わせカテゴリ']));
        }
    }
}
