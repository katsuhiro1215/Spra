<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\Portfolio;
use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * トップページ
     *
     * ヒーロー（3D）・イントロ・サービス・サポート・進め方の文章はコードに置き、
     * 管理画面で更新する内容（記事・FAQ・制作実績）だけをここで渡す。
     * 設計: docs/superpowers/specs/2026-10-30-public-site-renewal-design.md §6-3
     */
    public function index(): Response
    {
        return Inertia::render('Public/Home', [
            'journal' => Post::published()
                ->with('postCategory')
                ->recent(2)
                ->get()
                ->map($this->summarizePost(...)),
            'faqs' => $this->homeFaqs(),
            'works' => Portfolio::displayed()
                ->ordered()
                ->with('media')
                ->limit(6)
                ->get()
                ->map(fn (Portfolio $portfolio) => [
                    'id' => $portfolio->id,
                    'title' => $portfolio->title,
                    'description' => $portfolio->description,
                    'url' => $portfolio->url,
                    'image' => $portfolio->media?->url,
                    'date' => $portfolio->completed_at?->format('Y.m'),
                ]),
        ]);
    }

    /**
     * トップに出すFAQ。管理画面で「注目」にしたものを優先し、無ければ並び順の先頭から4件
     */
    private function homeFaqs()
    {
        $featured = Faq::published()->featured()->ordered()->limit(4)->get();
        $faqs = $featured->isNotEmpty() ? $featured : Faq::published()->ordered()->limit(4)->get();

        return $faqs->map(fn (Faq $faq) => [
            'id' => $faq->id,
            'question' => $faq->question,
            'answer' => trim(strip_tags($faq->answer)),
        ]);
    }

    private function summarizePost(Post $post): array
    {
        $isNews = $post->postCategory?->slug === 'news';

        return [
            'id' => $post->id,
            'title' => $post->title,
            'category' => $post->postCategory?->name,
            'href' => ($isNews ? '/news/' : '/blog/').$post->slug,
            'date' => $post->published_at?->format('Y.m.d'),
            'datetime' => $post->published_at?->toDateString(),
            'excerpt' => $post->excerpt,
            'image' => $post->thumbnail,
        ];
    }
}
