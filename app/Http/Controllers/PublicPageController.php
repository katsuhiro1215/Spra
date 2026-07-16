<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class PublicPageController extends Controller
{
    /**
     * 公開サイトの固定ページ(Page + ブロックエディタ content)
     */
    public function show(string $slug): InertiaResponse
    {
        $page = Page::where('slug', $slug)->published()->first();

        abort_unless($page, 404);

        return Inertia::render('Public/Page', [
            'page' => [
                'title' => $page->title,
                'meta_title' => $page->meta_title,
                'meta_description' => $page->meta_description,
                'template' => $page->template,
                'content' => $page->content,
            ],
        ]);
    }
}
