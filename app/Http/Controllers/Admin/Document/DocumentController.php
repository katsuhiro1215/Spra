<?php

namespace App\Http\Controllers\Admin\Document;

use App\Http\Controllers\Controller;
use App\Http\Requests\DocumentRequest;
use App\Models\Document;
use App\Models\DocumentCategory;
use App\Models\DocumentVersion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * 文書一覧（カテゴリ別）
     */
    public function index()
    {
        $categories = DocumentCategory::ordered()
            ->with(['documents' => function ($query) {
                $query->ordered()->withCount('versions')->with('activeVersion:id,document_id,version,effective_date');
            }])
            ->get();

        return Inertia::render('Admin/Documents/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * 新規文書作成フォーム
     */
    public function create()
    {
        return Inertia::render('Admin/Documents/Create', [
            'categories' => DocumentCategory::ordered()->get(),
        ]);
    }

    /**
     * 新規文書を保存（初回バージョンも同時に作成）
     */
    public function store(DocumentRequest $request)
    {
        $validated = $request->validated();

        $document = Document::create([
            'document_category_id' => $validated['document_category_id'],
            'title' => $validated['title'],
            'slug' => $validated['slug'] ?? null,
            'description' => $validated['description'] ?? null,
            'requires_acceptance' => $validated['requires_acceptance'] ?? false,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        $document->versions()->create([
            'version' => 1,
            'content' => $validated['content'],
            'status' => 'draft',
            'created_by' => auth('admins')->id(),
        ]);

        return redirect()->route('admin.documents.edit', $document)
            ->with('success', __('messages.created', ['attribute' => '文書']));
    }

    /**
     * 文書編集画面（バージョン一覧・内容編集）
     */
    public function edit(Document $document)
    {
        return Inertia::render('Admin/Documents/Edit', [
            'document' => $document->load('category'),
            'versions' => $document->versions()->with('creator')->get(),
            'categories' => DocumentCategory::ordered()->get(),
        ]);
    }

    /**
     * 文書のメタ情報を更新
     */
    public function update(DocumentRequest $request, Document $document)
    {
        $document->update($request->validated());

        return redirect()->route('admin.documents.edit', $document)
            ->with('success', __('messages.updated', ['attribute' => '文書情報']));
    }

    /**
     * 文書を削除（ソフトデリート、バージョンも含む）
     */
    public function destroy(Document $document)
    {
        $document->versions()->delete();
        $document->delete();

        return redirect()->route('admin.documents.index')
            ->with('success', __('messages.deleted', ['attribute' => '文書']));
    }

    /**
     * 新しいバージョンを作成
     */
    public function createVersion(Request $request, Document $document)
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $latestVersion = $document->versions()->first();

        $newVersion = $latestVersion
            ? DocumentVersion::createNewVersion($latestVersion, [
                'content' => $validated['content'],
                'created_by' => auth('admins')->id(),
            ])
            : $document->versions()->create([
                'version' => 1,
                'content' => $validated['content'],
                'status' => 'draft',
                'created_by' => auth('admins')->id(),
            ]);

        return redirect()->route('admin.documents.edit', $document)
            ->with('success', __('messages.created', ['attribute' => '新しいバージョン']));
    }

    /**
     * バージョンの内容を更新（ドラフトのみ）
     */
    public function updateVersion(Request $request, Document $document, DocumentVersion $version)
    {
        if ($version->status !== 'draft') {
            return back()->withErrors(['content' => __('messages.draft_version_only_editable')]);
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $version->update($validated);

        return redirect()->route('admin.documents.edit', $document)
            ->with('success', __('messages.updated', ['attribute' => '内容']));
    }

    /**
     * バージョンを有効化
     */
    public function activateVersion(Document $document, DocumentVersion $version)
    {
        $version->activate();

        return back()->with('success', __('messages.activated', ['attribute' => 'バージョン']));
    }

    /**
     * バージョンをドラフトに戻す
     */
    public function revertVersionToDraft(Document $document, DocumentVersion $version)
    {
        if ($version->status !== 'active') {
            return back()->withErrors(['version' => '有効なバージョンのみドラフトに戻せます。']);
        }

        $version->revertToDraft();

        return back()->with('success', __('messages.document.reverted_to_draft'));
    }
}
