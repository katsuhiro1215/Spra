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
        return Inertia::render('Admin/Technologies/Index', [
            'technologies' => Technology::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Technologies/Create');
    }

    public function store(TechnologyRequest $request): RedirectResponse
    {
        $this->technologyService->create($request->validated());

        return redirect()
            ->route('admin.service.technology.index')
            ->with('success', __('messages.created', ['attribute' => '技術']));
    }

    public function edit(Technology $technology): Response
    {
        return Inertia::render('Admin/Technologies/Edit', [
            'technology' => $technology,
        ]);
    }

    public function update(TechnologyRequest $request, Technology $technology): RedirectResponse
    {
        $this->technologyService->update($technology, $request->validated());

        return redirect()
            ->route('admin.service.technology.index')
            ->with('success', __('messages.updated', ['attribute' => '技術']));
    }

    public function destroy(Technology $technology): RedirectResponse
    {
        if ($technology->services()->count() > 0) {
            return redirect()
                ->route('admin.service.technology.index')
                ->with('error', __('messages.technology.in_use'));
        }

        $this->technologyService->delete($technology);

        return redirect()
            ->route('admin.service.technology.index')
            ->with('success', __('messages.deleted', ['attribute' => '技術']));
    }
}
