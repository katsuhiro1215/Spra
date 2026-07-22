<?php

namespace App\Http\Controllers\Admin\Website;

use App\Http\Controllers\Controller;
use App\Http\Requests\Website\MenuRequest;
use App\Models\Menu;
use App\Services\MenuService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function __construct(private MenuService $menuService)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'location' => $request->input('location'),
        ];

        $sort = [
            'field' => $request->input('sort_field', 'name'),
            'direction' => $request->input('sort_direction', 'asc'),
        ];

        $menus = $this->menuService->getPaginated($filters, $sort, 20);
        $stats = $this->menuService->getStats();

        return Inertia::render('Admin/Website/Menu/Index', [
            'menus' => $menus,
            'stats' => $stats,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Website/Menu/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MenuRequest $request): RedirectResponse
    {
        try {
            $this->menuService->createMenu($request->validated());

            return redirect()
                ->route('admin.website.menu.index')
                ->with('success', __('messages.created', ['attribute' => 'メニュー']));
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'メニューの作成に失敗しました。']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Menu $menu): Response
    {
        $menu->load(['menuItems', 'createdBy', 'updatedBy']);

        return Inertia::render('Admin/Website/Menu/Show', [
            'menu' => $menu,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Menu $menu): Response
    {
        return Inertia::render('Admin/Website/Menu/Edit', [
            'menu' => $menu,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MenuRequest $request, Menu $menu): RedirectResponse
    {
        try {
            $this->menuService->updateMenu($menu, $request->validated());

            return redirect()
                ->route('admin.website.menu.index')
                ->with('success', __('messages.updated', ['attribute' => 'メニュー']));
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'メニューの更新に失敗しました。']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Menu $menu): RedirectResponse
    {
        try {
            $this->menuService->deleteMenu($menu);

            return redirect()
                ->route('admin.website.menu.index')
                ->with('success', __('messages.deleted', ['attribute' => 'メニュー']));
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }
}
