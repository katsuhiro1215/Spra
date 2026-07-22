<?php

namespace App\Http\Controllers\Admin\Service;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\Service;
use App\Services\ServiceService;
use App\Services\ServiceCategoryService;
use App\Services\TechnologyService;
use App\Http\Requests\ServiceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function __construct(
        private ServiceService $serviceService,
        private ServiceCategoryService $serviceCategoryService,
        private TechnologyService $technologyService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'category', 'is_featured', 'trashed']);
        $sort = [
            'field' => $request->get('sort', 'sort_order'),
            'direction' => $request->get('direction', 'asc')
        ];

        $services = $this->serviceService->getPaginated($filters, $sort, 20);

        $statuses = $this->serviceService->getStatuses();

        $categories = $this->serviceCategoryService->getForSelect();

        $stats = $this->serviceService->getStats();

        return Inertia::render('Admin/Services/Index', [
            'services' => $services,
            'statuses' => $statuses,
            'categories' => $categories,
            'filters' => $filters,
            'sort' => $sort,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $statuses = $this->serviceService->getStatuses();
        $categories = $this->serviceCategoryService->getActiveForSelect();

        return Inertia::render('Admin/Services/Create', [
            'statuses' => $statuses,
            'categories' => $categories,
            'technologies' => $this->technologyService->getActiveForSelect(),
            'mediaList' => Media::query()->images()->latest()->limit(100)->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ServiceRequest $request)
    {
        try {
            $this->serviceService->createService($request->validated());

            return redirect()->route('admin.service.index')
                ->with('success', __('messages.created', ['attribute' => 'サービス']));
        } catch (\Exception $e) {
            Log::error('Service store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.create_failed', ['attribute' => 'サービス']));
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service): Response
    {
        $servicePlans = $service->servicePlans()
            ->with(['creator', 'updater', 'serviceItems'])
            ->orderBy('sort_order')
            ->get();

        $serviceItems = $service->serviceItems()
            ->with(['creator', 'updater', 'servicePlanItems.servicePlan'])
            ->orderBy('sort_order')
            ->get();

        // サムネイル選択用のメディア一覧を取得
        $mediaList = Media::query()->images()->latest()->limit(100)->get();

        return Inertia::render('Admin/Services/Show', [
            'service' => $service->load([
                'serviceCategory',
                'creator',
                'updater',
                'media',
                'thumbnail',
                'technologies',
                'portfolios',
            ]),
            'servicePlans' => $servicePlans,
            'serviceItems' => $serviceItems,
            'mediaList' => $mediaList,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service): Response
    {
        $statuses = $this->serviceService->getStatuses();
        $categories = $this->serviceCategoryService->getActiveForSelect();
        $service->load(['media', 'technologies']);

        return Inertia::render('Admin/Services/Edit', [
            'service' => $service,
            'statuses' => $statuses,
            'categories' => $categories,
            'technologies' => $this->technologyService->getActiveForSelect(),
            'mediaList' => Media::query()->images()->latest()->limit(100)->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ServiceRequest $request, Service $service)
    {
        try {
            $this->serviceService->updateService($service, $request->validated());

            return redirect()->route('admin.service.index')
                ->with('success', __('messages.updated', ['attribute' => 'サービス']));
        } catch (\Exception $e) {
            Log::error('Service update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.update_failed', ['attribute' => 'サービス']));
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        try {
            $this->serviceService->deleteService($service);

            return redirect()->route('admin.service.index')
                ->with('success', __('messages.deleted', ['attribute' => 'サービス']));
        } catch (\Exception $e) {
            Log::error('Service destroy error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }

    // -------------------------
    // サービスサムネイル画像
    // -------------------------

    /**
     * サムネイル画像を設定
     */
    public function attachMedia(Request $request, Service $service)
    {
        $validated = $request->validate([
            'media_id' => ['required', 'exists:media,id'],
        ]);

        try {
            $service->update(['media_id' => $validated['media_id']]);

            return back()->with('success', __('messages.set', ['attribute' => 'サムネイル画像']));
        } catch (\Exception $e) {
            Log::error('サービスサムネイル設定エラー', [
                'message' => $e->getMessage(),
                'service_id' => $service->id,
                'media_id' => $validated['media_id'],
            ]);

            return back()->with('error', __('messages.set_failed', ['attribute' => '画像']));
        }
    }

    /**
     * サムネイル画像を削除
     */
    public function detachMedia(Service $service)
    {
        try {
            $service->update(['media_id' => null]);

            return back()->with('success', __('messages.deleted', ['attribute' => 'サムネイル画像']));
        } catch (\Exception $e) {
            Log::error('サービスサムネイル削除エラー', [
                'message' => $e->getMessage(),
                'service_id' => $service->id,
            ]);

            return back()->with('error', __('messages.delete_failed', ['attribute' => '画像']));
        }
    }
}
