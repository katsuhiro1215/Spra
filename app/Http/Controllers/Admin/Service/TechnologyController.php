<?php

namespace App\Http\Controllers\Admin\Service;

use App\Http\Controllers\Controller;
use App\Http\Requests\TechnologyRequest;
use App\Models\Technology;
use App\Services\TechnologyService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TechnologyController extends Controller
{
    public function __construct(
        private TechnologyService $technologyService
    ) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Service/Technology/Index', [
            'technologies' => Technology::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Service/Technology/Create');
    }

    public function store(TechnologyRequest $request): RedirectResponse
    {
        $this->technologyService->create($request->validated());

        return redirect()
            ->route('admin.service.technology.index')
            ->with('success', '技術を作成しました。');
    }

    public function edit(Technology $technology): Response
    {
        return Inertia::render('Admin/Service/Technology/Edit', [
            'technology' => $technology,
        ]);
    }

    public function update(TechnologyRequest $request, Technology $technology): RedirectResponse
    {
        $this->technologyService->update($technology, $request->validated());

        return redirect()
            ->route('admin.service.technology.index')
            ->with('success', '技術を更新しました。');
    }

    public function destroy(Technology $technology): RedirectResponse
    {
        if ($technology->services()->count() > 0) {
            return redirect()
                ->route('admin.service.technology.index')
                ->with('error', 'この技術は使用中のサービスがあるため削除できません。');
        }

        $this->technologyService->delete($technology);

        return redirect()
            ->route('admin.service.technology.index')
            ->with('success', '技術を削除しました。');
    }
}
