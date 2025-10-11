<?php

namespace App\Http\Controllers\Admin\Homepage;

use App\Http\Controllers\Controller;
use App\Models\ServiceCategory;
use App\Http\Requests\StoreServiceCategoryRequest;
use App\Http\Requests\UpdateServiceCategoryRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Homepage/Services/Categories/Index', [
            'serviceCategories' => ServiceCategory::ordered()->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Homepage/Services/Categories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreServiceCategoryRequest $request)
    {
        ServiceCategory::create($request->validated());

        return redirect()->route('admin.homepage.serviceCategories.index')
            ->with('success', 'サービスカテゴリが作成されました。');
    }

    /**
     * Display the specified resource.
     */
    public function show(ServiceCategory $serviceCategory): Response
    {
        return Inertia::render('Admin/Homepage/Services/Categories/Show', [
            'serviceCategory' => $serviceCategory,
            'servicesCount' => $serviceCategory->services()->count(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ServiceCategory $serviceCategory): Response
    {
        return Inertia::render('Admin/Homepage/Services/Categories/Edit', [
            'serviceCategory' => $serviceCategory,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServiceCategoryRequest $request, ServiceCategory $serviceCategory)
    {
        $serviceCategory->update($request->validated());

        return redirect()->route('admin.homepage.serviceCategories.index')
            ->with('success', 'サービスカテゴリが更新されました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ServiceCategory $serviceCategory)
    {
        // サービスが紐づいている場合は削除を防ぐ
        if ($serviceCategory->services()->count() > 0) {
            return redirect()->back()
                ->with('error', 'このカテゴリにはサービスが紐づいているため削除できません。');
        }

        $serviceCategory->delete();

        return redirect()->route('admin.homepage.serviceCategories.index')
            ->with('success', 'サービスカテゴリが削除されました。');
    }
}
