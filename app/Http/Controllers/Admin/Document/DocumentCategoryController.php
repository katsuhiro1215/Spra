<?php

namespace App\Http\Controllers\Admin\Document;

use App\Http\Controllers\Controller;
use App\Http\Requests\DocumentCategoryRequest;
use App\Models\DocumentCategory;

class DocumentCategoryController extends Controller
{
    /**
     * カテゴリを作成
     */
    public function store(DocumentCategoryRequest $request)
    {
        DocumentCategory::create($request->validated());

        return redirect()->route('admin.documents.index')
            ->with('success', __('messages.created', ['attribute' => 'カテゴリ']));
    }

    /**
     * カテゴリを更新
     */
    public function update(DocumentCategoryRequest $request, DocumentCategory $documentCategory)
    {
        $documentCategory->update($request->validated());

        return redirect()->route('admin.documents.index')
            ->with('success', __('messages.updated', ['attribute' => 'カテゴリ']));
    }

    /**
     * カテゴリを削除（配下に文書がない場合のみ）
     */
    public function destroy(DocumentCategory $documentCategory)
    {
        if ($documentCategory->documents()->exists()) {
            return back()->withErrors(['category' => 'このカテゴリには文書が存在するため削除できません。']);
        }

        $documentCategory->delete();

        return redirect()->route('admin.documents.index')
            ->with('success', __('messages.deleted', ['attribute' => 'カテゴリ']));
    }
}
