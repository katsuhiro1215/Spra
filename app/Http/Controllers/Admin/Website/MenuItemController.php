<?php

namespace App\Http\Controllers\Admin\Website;

use App\Http\Controllers\Controller;
use App\Http\Requests\Website\MenuItemRequest;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Page;
use App\Services\MenuItemService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MenuItemController extends Controller
{
    public function __construct(private MenuItemService $menuItemService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Menu $menu): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'menu_id' => $menu->id,
            'parent_id' => $request->input('parent_id'),
            'is_active' => $request->input('is_active'),
            'trashed' => $request->input('trashed', 'without'),
        ];

        $sort = [
            'field' => $request->input('sort_field', 'sort_order'),
            'direction' => $request->input('sort_direction', 'asc'),
        ];

        $menuItems = $this->menuItemService->getPaginated($filters, $sort, 20);
        $stats = $this->menuItemService->getStatsByMenu($menu->id);
        $allMenuItems = MenuItem::where('menu_id', $menu->id)->orderBy('label')->get(['id', 'label']);

        return Inertia::render('Admin/Website/MenuItem/Index', [
            'menu' => $menu,
            'menuItems' => $menuItems,
            'stats' => $stats,
            'allMenuItems' => $allMenuItems,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Menu $menu): Response
    {
        $pages = Page::orderBy('title')->get(['id', 'title']);
        $menuItems = MenuItem::where('menu_id', $menu->id)->orderBy('label')->get(['id', 'label']);

        return Inertia::render('Admin/Website/MenuItem/Create', [
            'menu' => $menu,
            'pages' => $pages,
            'menuItems' => $menuItems,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MenuItemRequest $request, Menu $menu): RedirectResponse
    {
        try {
            $data = $request->validated();
            $data['menu_id'] = $menu->id;

            $this->menuItemService->createMenuItem($data);

            return redirect()
                ->route('admin.website.menu.item.index', $menu->id)
                ->with('success', __('messages.created', ['attribute' => 'メニューアイテム']));
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'メニューアイテムの作成に失敗しました。']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Menu $menu, MenuItem $menuItem): Response
    {
        $menuItem->load(['page', 'parent', 'children', 'createdBy', 'updatedBy']);

        return Inertia::render('Admin/Website/MenuItem/Show', [
            'menu' => $menu,
            'menuItem' => $menuItem,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Menu $menu, MenuItem $menuItem): Response
    {
        $menuItem->load(['page', 'parent']);
        $pages = Page::orderBy('title')->get(['id', 'title']);
        $menuItems = MenuItem::where('menu_id', $menu->id)
            ->where('id', '!=', $menuItem->id)
            ->orderBy('label')
            ->get(['id', 'label']);

        return Inertia::render('Admin/Website/MenuItem/Edit', [
            'menu' => $menu,
            'menuItem' => $menuItem,
            'pages' => $pages,
            'menuItems' => $menuItems,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MenuItemRequest $request, Menu $menu, MenuItem $menuItem): RedirectResponse
    {
        try {
            $this->menuItemService->updateMenuItem($menuItem, $request->validated());

            return redirect()
                ->route('admin.website.menu.item.index', $menu->id)
                ->with('success', __('messages.updated', ['attribute' => 'メニューアイテム']));
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'メニューアイテムの更新に失敗しました。']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Menu $menu, MenuItem $menuItem): RedirectResponse
    {
        try {
            $this->menuItemService->deleteMenuItem($menuItem);

            return redirect()
                ->route('admin.website.menu.item.index', $menu->id)
                ->with('success', __('messages.deleted', ['attribute' => 'メニューアイテム']));
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }
}
