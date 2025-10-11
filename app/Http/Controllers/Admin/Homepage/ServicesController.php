<?php

namespace App\Http\Controllers\Admin\Homepage;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Service::with('serviceCategory')->ordered();

        // カテゴリフィルター
        if ($request->filled('category')) {
            $query->byCategory($request->category);
        }

        // ステータスフィルター
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'featured') {
                $query->featured();
            }
        }

        return Inertia::render('Admin/Homepage/Services/Index', [
            'services' => $query->get(),
            'serviceCategories' => ServiceCategory::active()->ordered()->get(),
            'filters' => $request->only(['category', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Homepage/Services/Create', [
            'serviceCategories' => ServiceCategory::active()->ordered()->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreServiceRequest $request)
    {
        Service::create($request->validated());

        return redirect()->route('admin.homepage.services.index')
            ->with('success', 'サービスが作成されました。');
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service): Response
    {
        $service->load('serviceCategory');

        return Inertia::render('Admin/Homepage/Services/Show', [
            'service' => $service,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service): Response
    {
        $service->load('serviceCategory');

        return Inertia::render('Admin/Homepage/Services/Edit', [
            'service' => $service,
            'serviceCategories' => ServiceCategory::active()->ordered()->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServiceRequest $request, Service $service)
    {
        $service->update($request->validated());

        return redirect()->route('admin.homepage.services.index')
            ->with('success', 'サービスが更新されました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        $service->delete();

        return redirect()->route('admin.homepage.services.index')
            ->with('success', 'サービスが削除されました。');
    }
}
