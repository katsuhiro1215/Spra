<?php

namespace App\Http\Controllers\Admin\Contact;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactApiClientRequest;
use App\Services\ContactApiClientService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * 外部サイト連携用APIクライアント管理コントローラー
 */
class ContactApiClientController extends Controller
{
    public function __construct(
        private ContactApiClientService $service
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search']);
        $sort = [
            'field' => $request->get('sort_field', 'created_at'),
            'direction' => $request->get('sort_direction', 'desc'),
        ];

        $clients = $this->service->getPaginated($filters, $sort, 20);
        $stats = $this->service->getStats();

        return Inertia::render('Admin/Contact/ApiClient/Index', [
            'clients' => $clients,
            'stats' => $stats,
            'filters' => $filters,
            'apiBaseUrl' => config('app.url') . '/api/contacts',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Contact/ApiClient/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ContactApiClientRequest $request): RedirectResponse
    {
        $result = $this->service->createWithKey(
            $request->validated(),
            auth('admins')->id()
        );

        return redirect()
            ->route('admin.contact.api-client.index')
            ->with('message', 'APIクライアントを作成しました。表示されたAPIキーは今だけ確認できます。')
            ->with('api_key_reveal', [
                'clientId' => $result['client']->id,
                'name' => $result['client']->name,
                'plainKey' => $result['plainKey'],
                'apiBaseUrl' => config('app.url') . '/api/contacts',
            ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id): Response
    {
        $client = $this->service->findById($id);

        return Inertia::render('Admin/Contact/ApiClient/Edit', [
            'client' => $client,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ContactApiClientRequest $request, string $id): RedirectResponse
    {
        $client = $this->service->findById($id);
        $this->service->update($client, $request->validated());

        return redirect()
            ->route('admin.contact.api-client.index')
            ->with('message', 'APIクライアントを更新しました。');
    }

    /**
     * Toggle active state
     */
    public function toggleActive(string $id): RedirectResponse
    {
        $client = $this->service->findById($id);
        $this->service->update($client, ['is_active' => !$client->is_active]);

        return redirect()
            ->route('admin.contact.api-client.index')
            ->with('message', $client->is_active ? 'APIクライアントを無効化しました。' : 'APIクライアントを有効化しました。');
    }

    /**
     * APIキーを再発行する(旧キーは即失効)
     */
    public function regenerate(string $id): RedirectResponse
    {
        $client = $this->service->findById($id);
        $result = $this->service->regenerateKey($client);

        return redirect()
            ->route('admin.contact.api-client.index')
            ->with('message', 'APIキーを再発行しました。以前のキーは無効になりました。')
            ->with('api_key_reveal', [
                'clientId' => $result['client']->id,
                'name' => $result['client']->name,
                'plainKey' => $result['plainKey'],
                'apiBaseUrl' => config('app.url') . '/api/contacts',
            ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        $client = $this->service->findById($id);

        if (!$client) {
            return redirect()
                ->route('admin.contact.api-client.index')
                ->with('error', 'APIクライアントが見つかりません。');
        }

        $this->service->delete($client);

        return redirect()
            ->route('admin.contact.api-client.index')
            ->with('message', 'APIクライアントを削除しました。');
    }
}
