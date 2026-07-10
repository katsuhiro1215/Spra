<?php

namespace App\Http\Controllers\Admin\Term;

use App\Http\Controllers\Controller;
use App\Models\Term;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TermController extends Controller
{
    /**
     * 規約一覧を表示（全バージョン）
     */
    public function index()
    {
        $terms = Term::with('creator')
            ->orderBy('title')
            ->orderByDesc('version')
            ->paginate(20);

        return Inertia::render('Admin/Terms/Index', [
            'terms' => $terms,
        ]);
    }

    /**
     * 新規規約作成フォーム
     */
    public function create()
    {
        return Inertia::render('Admin/Terms/Create');
    }

    /**
     * 新規規約を保存
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'version' => 'sometimes|integer|min:1',
        ]);

        // 同じ title の最新バージョンを取得して version を決定
        $latestVersion = Term::where('title', $validated['title'])
            ->max('version') ?? 0;

        $term = Term::create([
            ...$validated,
            'version' => $validated['version'] ?? $latestVersion + 1,
            'status' => 'draft',
            'created_by' => auth('admin')->id(),
        ]);

        return redirect()->route('admin.terms.edit', $term->id)
            ->with('success', '規約を作成しました。');
    }

    /**
     * 規約の詳細表示
     */
    public function show(Term $term)
    {
        return Inertia::render('Admin/Terms/Show', [
            'term' => $term->load('creator'),
        ]);
    }

    /**
     * 規約編集フォーム
     */
    public function edit(Term $term)
    {
        return Inertia::render('Admin/Terms/Edit', [
            'term' => $term->load('creator'),
            'versions' => Term::where('title', $term->title)
                ->orderByDesc('version')
                ->get(['id', 'version', 'status', 'effective_date', 'created_at']),
        ]);
    }

    /**
     * 規約を更新（ドラフトのみ）
     */
    public function update(Request $request, Term $term)
    {
        // ドラフトのみ編集可能
        if ($term->status !== 'draft') {
            return back()->withErrors(['Cannot edit non-draft terms']);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
        ]);

        $term->update($validated);

        return redirect()->route('admin.terms.edit', $term->id)
            ->with('success', '規約を更新しました。');
    }

    /**
     * 規約を有効化
     */
    public function activate(Request $request, Term $term)
    {
        $term->activate();

        return back()->with('success', '規約を有効化しました。');
    }

    /**
     * 規約をドラフトに戻す
     */
    public function revertToDraft(Request $request, Term $term)
    {
        if ($term->status !== 'active') {
            return back()->withErrors(['Can only revert active terms to draft']);
        }

        $term->revertToDraft();

        return back()->with('success', '規約をドラフト状態に戻しました。');
    }

    /**
     * 規約を削除（ソフトデリート）
     */
    public function destroy(Term $term)
    {
        $term->delete();

        return redirect()->route('admin.terms.index')
            ->with('success', '規約を削除しました。');
    }

    /**
     * 新しいバージョンを作成
     */
    public function createVersion(Request $request, Term $term)
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $newTerm = Term::createNewVersion($term, $validated + [
            'created_by' => auth('admin')->id(),
        ]);

        return redirect()->route('admin.terms.edit', $newTerm->id)
            ->with('success', '新しいバージョンを作成しました。');
    }
}
