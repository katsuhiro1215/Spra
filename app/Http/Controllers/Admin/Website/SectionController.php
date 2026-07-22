<?php

namespace App\Http\Controllers\Admin\Website;

use App\Http\Controllers\Controller;
use App\Http\Requests\Website\SectionRequest;
use App\Models\Media;
use App\Models\Page;
use App\Models\Section;
use App\Services\SectionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SectionController extends Controller
{
    public function __construct(
        private SectionService $sectionService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'page_id' => $request->input('page_id'),
            'role' => $request->input('role'),
            'trashed' => $request->input('trashed', 'without'),
        ];

        $sort = [
            'field' => $request->input('sort_field', 'sort_order'),
            'direction' => $request->input('sort_direction', 'asc'),
        ];

        $sections = $this->sectionService->getPaginated($filters, $sort, 20);
        $stats = $this->sectionService->getStats();
        $pages = Page::orderBy('title')->get(['id', 'title']);

        return Inertia::render('Admin/Website/Section/Index', [
            'sections' => $sections,
            'stats' => $stats,
            'pages' => $pages,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $pages = Page::orderBy('title')->get(['id', 'title']);

        return Inertia::render('Admin/Website/Section/Create', [
            'pages' => $pages,
            'mediaList' => Media::query()->images()->latest()->limit(100)->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SectionRequest $request): RedirectResponse
    {
        try {
            $this->sectionService->createSection($request->validated());

            return redirect()
                ->route('admin.website.section.index')
                ->with('success', __('messages.created', ['attribute' => 'セクション']));
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'セクションの作成に失敗しました。']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Section $section): Response
    {
        $section->load(['page', 'createdBy', 'updatedBy']);

        return Inertia::render('Admin/Website/Section/Show', [
            'section' => $section,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Section $section): Response
    {
        $section->load('page');
        $pages = Page::orderBy('title')->get(['id', 'title']);

        return Inertia::render('Admin/Website/Section/Edit', [
            'section' => $section,
            'pages' => $pages,
            'mediaList' => Media::query()->images()->latest()->limit(100)->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SectionRequest $request, Section $section): RedirectResponse
    {
        try {
            $this->sectionService->updateSection($section, $request->validated());

            return redirect()
                ->route('admin.website.section.index')
                ->with('success', __('messages.updated', ['attribute' => 'セクション']));
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'セクションの更新に失敗しました。']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Section $section): RedirectResponse
    {
        try {
            $this->sectionService->deleteSection($section);

            return redirect()
                ->route('admin.website.section.index')
                ->with('success', __('messages.deleted', ['attribute' => 'セクション']));
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'セクションの削除に失敗しました。']);
        }
    }

    /**
     * セクションの並び順を一括更新（ページ編集画面のドラッグ&ドロップ用）
     */
    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'section_ids' => ['required', 'array'],
            'section_ids.*' => ['string', 'exists:sections,id'],
        ]);

        try {
            $this->sectionService->reorderSections($validated['section_ids']);

            return back();
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'セクションの並び替えに失敗しました。']);
        }
    }
}
