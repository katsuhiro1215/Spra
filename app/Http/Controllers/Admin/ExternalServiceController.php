<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExternalServiceRequest;
use App\Services\ExternalServiceService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * 外部SaaS/サービス連携（リンク集約・API経由でのデータ取得）管理コントローラー
 */
class ExternalServiceController extends Controller
{
    public function __construct(
        private ExternalServiceService $service
    ) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['search']);
        $sort = [
            'field' => $request->get('sort_field', 'sort_order'),
            'direction' => $request->get('sort_direction', 'asc'),
        ];

        $services = $this->service->getPaginated($filters, $sort, 20);
        $stats = $this->service->getStats();

        return Inertia::render('Admin/ExternalService/Index', [
            'services' => $services,
            'stats' => $stats,
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/ExternalService/Create');
    }

    public function store(ExternalServiceRequest $request): RedirectResponse
    {
        $data = $this->normalizeCredential($request->validated());
        $data['created_by'] = auth('admins')->id();

        $this->service->create($data);

        return redirect()
            ->route('admin.external-service.index')
            ->with('message', '外部サービスを登録しました。');
    }

    public function edit(string $id): Response
    {
        $externalService = $this->service->findById($id);

        return Inertia::render('Admin/ExternalService/Edit', [
            'service' => $externalService,
        ]);
    }

    public function update(ExternalServiceRequest $request, string $id): RedirectResponse
    {
        $externalService = $this->service->findById($id);

        $data = $request->validated();

        // 資格情報を空欄のまま更新した場合は既存値を保持する（クリア用UIは用意していないため）
        if (empty($data['credential'])) {
            unset($data['credential']);
        }

        $this->service->update($externalService, $data);

        return redirect()
            ->route('admin.external-service.index')
            ->with('message', '外部サービスを更新しました。');
    }

    public function toggleActive(string $id): RedirectResponse
    {
        $externalService = $this->service->findById($id);
        $this->service->update($externalService, ['is_active' => ! $externalService->is_active]);

        return redirect()
            ->route('admin.external-service.index')
            ->with('message', $externalService->is_active ? '無効化しました。' : '有効化しました。');
    }

    public function sync(string $id): RedirectResponse
    {
        $externalService = $this->service->findById($id);
        $synced = $this->service->sync($externalService);

        return redirect()
            ->route('admin.external-service.index')
            ->with(
                $synced->last_sync_status === 'success' ? 'message' : 'error',
                $synced->last_sync_status === 'success'
                    ? "「{$synced->name}」のデータを取得しました。"
                    : "「{$synced->name}」のデータ取得に失敗しました: {$synced->last_sync_error}"
            );
    }

    public function destroy(string $id): RedirectResponse
    {
        $externalService = $this->service->findById($id);
        $this->service->delete($externalService);

        return redirect()
            ->route('admin.external-service.index')
            ->with('message', '外部サービスを削除しました。');
    }

    private function normalizeCredential(array $data): array
    {
        if (array_key_exists('credential', $data) && $data['credential'] === '') {
            $data['credential'] = null;
        }

        return $data;
    }
}
