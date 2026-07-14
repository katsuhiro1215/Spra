<?php

namespace App\Http\Controllers;

use App\Services\ServiceService;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class PublicServiceController extends Controller
{
    public function __construct(
        private ServiceService $serviceService
    ) {}

    /**
     * 公開サイトのサービス一覧（Admin が表示フラグをONにしたものだけ）
     */
    public function index(): InertiaResponse
    {
        return Inertia::render('Public/Service', [
            'services' => $this->serviceService->getPublicList(),
        ]);
    }

    /**
     * 公開サイトのサービス詳細（Admin が表示フラグをONにしたものだけ）
     */
    public function show(string $slug): InertiaResponse
    {
        $service = $this->serviceService->getPublicBySlug($slug);

        abort_unless($service, 404);

        return Inertia::render('Public/ServiceDetail', [
            'service' => $service,
            'relatedServices' => $this->serviceService->getPublicRelated($service),
        ]);
    }
}
