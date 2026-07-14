<?php

namespace App\Http\Controllers\Admin\Contact;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResponseTemplateRequest;
use App\Models\ResponseTemplate;
use App\Services\ResponseTemplateService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ResponseTemplateController extends Controller
{
    public function __construct(
        private ResponseTemplateService $responseTemplateService
    ) {}

    /**
     * Display a listing of response templates.
     */
    public function index(Request $request): InertiaResponse
    {
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'category' => $request->input('category'),
        ];

        $sort = [
            'field' => $request->input('sort_field', 'sort_order'),
            'direction' => $request->input('sort_direction', 'asc'),
        ];

        $templates = $this->responseTemplateService->getPaginated(
            $filters,
            $sort,
            $request->input('per_page', 20)
        );

        return Inertia::render('Admin/Responses/Template/Index', [
            'templates' => $templates,
            'filters' => $filters,
            'sort' => $sort,
            'statuses' => $this->responseTemplateService->getStatuses(),
            'categories' => $this->responseTemplateService->getCategories(),
        ]);
    }

    /**
     * Show the form for creating a new template.
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('Admin/Responses/Template/Create', [
            'categories' => $this->responseTemplateService->getCategories(),
            'statuses' => $this->responseTemplateService->getStatuses(),
            'placeholders' => $this->responseTemplateService->getAvailablePlaceholders(),
        ]);
    }

    /**
     * Store a newly created template.
     */
    public function store(ResponseTemplateRequest $request)
    {
        $validated = $request->validated();

        try {
            $validated['created_by'] = auth('admins')->id();
            $validated['updated_by'] = auth('admins')->id();

            $this->responseTemplateService->createResponseTemplate($validated);

            return redirect()->route('admin.response.template.index')
                ->with('success', '返答テンプレートを作成しました。');
        } catch (\Exception $e) {
            return back()->with('error', 'テンプレートの作成に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified template.
     */
    public function show(ResponseTemplate $responseTemplate): InertiaResponse
    {
        $responseTemplate->load(['creator', 'updater']);

        return Inertia::render('Admin/Responses/Template/Show', [
            'template' => $responseTemplate,
            'placeholders' => $this->responseTemplateService->getAvailablePlaceholders(),
        ]);
    }

    /**
     * Show the form for editing the specified template.
     */
    public function edit(ResponseTemplate $responseTemplate): InertiaResponse
    {
        return Inertia::render('Admin/Responses/Template/Edit', [
            'template' => $responseTemplate,
            'categories' => $this->responseTemplateService->getCategories(),
            'statuses' => $this->responseTemplateService->getStatuses(),
            'placeholders' => $this->responseTemplateService->getAvailablePlaceholders(),
        ]);
    }

    /**
     * Update the specified template.
     */
    public function update(ResponseTemplateRequest $request, ResponseTemplate $responseTemplate)
    {
        $validated = $request->validated();

        try {
            $validated['updated_by'] = auth('admins')->id();

            $this->responseTemplateService->updateResponseTemplate($responseTemplate, $validated);

            return redirect()->route('admin.response.template.index')
                ->with('success', '返答テンプレートを更新しました。');
        } catch (\Exception $e) {
            return back()->with('error', 'テンプレートの更新に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified template.
     */
    public function destroy(ResponseTemplate $responseTemplate)
    {
        try {
            $this->responseTemplateService->deleteResponseTemplate($responseTemplate);

            return redirect()->route('admin.response.template.index')
                ->with('success', '返答テンプレートを削除しました。');
        } catch (\Exception $e) {
            return back()->with('error', 'テンプレートの削除に失敗しました: ' . $e->getMessage());
        }
    }
}
