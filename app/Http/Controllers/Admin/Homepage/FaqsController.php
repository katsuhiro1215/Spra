<?php

namespace App\Http\Controllers\Admin\Homepage;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFaqRequest;
use App\Http\Requests\UpdateFaqRequest;
use App\Models\Faq;
use App\Models\FaqCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Faq::with('faqCategory')
            ->orderBy('sort_order')
            ->orderBy('created_at', 'desc');

        // カテゴリフィルタ
        if ($request->filled('category')) {
            $query->byCategory($request->category);
        }

        // 公開状態フィルタ
        if ($request->filled('status')) {
            if ($request->status === 'published') {
                $query->published();
            } elseif ($request->status === 'draft') {
                $query->where('is_published', false);
            }
        }

        // よくある質問フィルタ
        if ($request->filled('featured')) {
            if ($request->featured === 'true') {
                $query->featured();
            }
        }

        // 検索
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('question', 'like', "%{$search}%")
                    ->orWhere('answer', 'like', "%{$search}%");
            });
        }

        $faqs = $query->paginate(15)->withQueryString();
        $categories = FaqCategory::active()->ordered()->get();

        return Inertia::render('Admin/Homepage/Faqs/Index', [
            'faqs' => $faqs,
            'categories' => $categories,
            'filters' => $request->only(['category', 'status', 'featured', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = FaqCategory::active()->ordered()->get();

        return Inertia::render('Admin/Homepage/Faqs/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFaqRequest $request)
    {
        $faq = Faq::create($request->validated());

        return redirect()->route('admin.homepage.faqs.index')
            ->with('success', 'FAQが正常に作成されました。');
    }

    /**
     * Display the specified resource.
     */
    public function show(Faq $faq)
    {
        $faq->load('faqCategory');

        return Inertia::render('Admin/Homepage/Faqs/Show', [
            'faq' => $faq,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Faq $faq)
    {
        $faq->load('faqCategory');
        $categories = FaqCategory::active()->ordered()->get();

        return Inertia::render('Admin/Homepage/Faqs/Edit', [
            'faq' => $faq,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFaqRequest $request, Faq $faq)
    {
        $faq->update($request->validated());

        return redirect()->route('admin.homepage.faqs.index')
            ->with('success', 'FAQが正常に更新されました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Faq $faq)
    {
        $faq->delete();

        return redirect()->route('admin.homepage.faqs.index')
            ->with('success', 'FAQが正常に削除されました。');
    }

    /**
     * 一括削除
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:faqs,id'],
        ]);

        Faq::whereIn('id', $request->ids)->delete();

        return redirect()->route('admin.homepage.faqs.index')
            ->with('success', '選択されたFAQが正常に削除されました。');
    }

    /**
     * 一括公開状態変更
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:faqs,id'],
            'is_published' => ['required', 'boolean'],
        ]);

        Faq::whereIn('id', $request->ids)->update([
            'is_published' => $request->is_published
        ]);

        $status = $request->is_published ? '公開' : '非公開';

        return redirect()->route('admin.homepage.faqs.index')
            ->with('success', "選択されたFAQが{$status}に変更されました。");
    }
}
