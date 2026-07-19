<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class PageController extends Controller
{
    /**
     * 公開サイトの固定ページ(Page + ブロックエディタ content)
     */
    public function show(string $slug): InertiaResponse
    {
        $page = Page::where('slug', $slug)->published()->first();

        abort_unless($page, 404);

        $page->load(['sections' => fn ($query) => $query->orderBy('sort_order')]);

        return Inertia::render('Public/Page', [
            'page' => [
                'title' => $page->title,
                'meta_title' => $page->meta_title,
                'meta_description' => $page->meta_description,
                'template' => $page->template,
                'sections' => $page->sections->map(fn ($section) => [
                    'id' => $section->id,
                    'role' => $section->role,
                    'content' => $section->content,
                ]),
            ],
        ]);
    }
}
