<?php

namespace App\Http\Controllers;

use App\Models\FaqCategory;
use App\Models\Page;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class PublicFaqController extends Controller
{
    /**
     * 公開サイトのFAQページ
     * ページのメタ情報は Website Page(CMS) から、質問一覧は FaqCategory/Faq から取得
     */
    public function show(): InertiaResponse
    {
        $page = Page::where('slug', 'faq')->published()->first();

        abort_unless($page, 404);

        $categories = FaqCategory::active()
            ->ordered()
            ->with(['publishedFaqs'])
            ->get()
            ->filter(fn (FaqCategory $category) => $category->publishedFaqs->isNotEmpty())
            ->values();

        return Inertia::render('Public/Faq', [
            'page' => [
                'title' => $page->title,
                'meta_title' => $page->meta_title,
                'meta_description' => $page->meta_description,
            ],
            'categories' => $categories,
        ]);
    }
}
