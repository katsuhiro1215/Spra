<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PortfolioRequest;
use App\Models\Media;
use App\Models\Portfolio;
use App\Models\Service;
use App\Services\PortfolioService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    public function __construct(
        private PortfolioService $portfolioService
    ) {}

    public function index(): Response
    {
        $portfolios = Portfolio::query()
            ->with(['media', 'services'])
            ->orderBy('sort_order')
            ->orderByDesc('completed_at')
            ->get();

        return Inertia::render('Admin/Portfolio/Index', [
            'portfolios' => $portfolios,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Portfolio/Create', [
            'services' => Service::query()->select('id', 'name')->orderBy('sort_order')->get(),
            'mediaList' => Media::query()->images()->latest()->limit(100)->get(),
        ]);
    }

    public function store(PortfolioRequest $request): RedirectResponse
    {
        $this->portfolioService->createPortfolio($request->validated());

        return redirect()
            ->route('admin.portfolio.index')
            ->with('success', '実績を作成しました。');
    }

    public function edit(Portfolio $portfolio): Response
    {
        return Inertia::render('Admin/Portfolio/Edit', [
            'portfolio' => $portfolio->load('media', 'services'),
            'services' => Service::query()->select('id', 'name')->orderBy('sort_order')->get(),
            'mediaList' => Media::query()->images()->latest()->limit(100)->get(),
        ]);
    }

    public function update(PortfolioRequest $request, Portfolio $portfolio): RedirectResponse
    {
        $this->portfolioService->updatePortfolio($portfolio, $request->validated());

        return redirect()
            ->route('admin.portfolio.index')
            ->with('success', '実績を更新しました。');
    }

    public function destroy(Portfolio $portfolio): RedirectResponse
    {
        $this->portfolioService->delete($portfolio);

        return redirect()
            ->route('admin.portfolio.index')
            ->with('success', '実績を削除しました。');
    }
}
