<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\LegacyDocumentRequest;
use App\Services\LegacyDocumentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LegacyDocumentController extends Controller
{
    public function __construct(
        private LegacyDocumentService $service,
    ) {}

    public function index(Request $request): Response
    {
        $documents = $this->service->getPaginated([
            'document_type' => $request->input('document_type'),
        ], perPage: 20);

        return Inertia::render('Admin/LegacyDocuments/Index', [
            'documents' => $documents,
        ]);
    }

    public function store(LegacyDocumentRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $this->service->register(
            $data,
            $request->file('file'),
            Auth::guard('admins')->id()
        );

        return redirect()->route('admin.legacy-document.index')
            ->with('success', __('messages.created', ['attribute' => '過去書類']));
    }
}
