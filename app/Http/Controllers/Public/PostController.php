<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    /**
     * ブログ一覧（news以外）
     */
    public function index(Request $request): Response
    {
        return $this->renderIndex($request, excludeCategory: 'news', heroTitle: 'Blog', heroSubtitle: 'ブログ');
    }

    /**
     * お知らせ一覧（news）
     */
    public function newsIndex(Request $request): Response
    {
        return $this->renderIndex($request, onlyCategory: 'news', heroTitle: 'News', heroSubtitle: 'お知らせ');
    }

    private function renderIndex(
        Request $request,
        ?string $onlyCategory = null,
        ?string $excludeCategory = null,
        string $heroTitle = 'Blog',
        string $heroSubtitle = '',
    ): Response {
        $search = $request->query('search');
        $categorySlug = $request->query('category');
        $tag = $request->query('tag');
        $year = $request->query('year');
        $month = $request->query('month');

        $baseQuery = function () use ($onlyCategory, $excludeCategory, $search, $categorySlug, $tag, $year, $month) {
            $query = Post::published()->with('postCategory');

            if ($onlyCategory) {
                $query->whereHas('postCategory', fn ($q) => $q->where('slug', $onlyCategory));
            } elseif ($excludeCategory) {
                $query->whereHas('postCategory', fn ($q) => $q->where('slug', '!=', $excludeCategory));
            }

            if ($search) {
                $query->where(fn ($q) => $q->where('title', 'like', "%{$search}%")->orWhere('excerpt', 'like', "%{$search}%"));
            }

            if ($categorySlug) {
                $query->whereHas('postCategory', fn ($q) => $q->where('slug', $categorySlug));
            }

            if ($tag) {
                $query->whereJsonContains('tags', $tag);
            }

            if ($year) {
                $query->whereYear('published_at', $year);
                if ($month) {
                    $query->whereMonth('published_at', $month);
                }
            }

            return $query;
        };

        $posts = $baseQuery()
            ->orderByDesc('published_at')
            ->paginate(9)
            ->withQueryString();

        $posts = $posts->through(fn (Post $post) => $this->transformPost($post));

        $featuredPosts = $onlyCategory === 'news'
            ? collect()
            : $baseQuery()->orderByDesc('views')->limit(3)->get()->map(fn (Post $post) => $this->transformPost($post));

        return Inertia::render('Public/Blog', [
            'posts' => $posts,
            'featuredPosts' => $featuredPosts,
            'categories' => PostCategory::active()->ordered()->get(['id', 'name', 'slug']),
            'archives' => $this->getArchives(),
            'tags' => $this->getTags(),
            'recentPosts' => Post::published()->recent(5)->get()->map(fn (Post $post) => $this->transformPost($post)),
            'heroTitle' => $heroTitle,
            'heroSubtitle' => $heroSubtitle,
            'filters' => [
                'search' => $search ?? '',
                'category' => $categorySlug ?? '',
                'tag' => $tag ?? '',
            ],
        ]);
    }

    /**
     * 記事詳細（/blog/{slug}, /news/{slug} 共通）
     */
    public function show(string $slug): Response
    {
        $post = Post::published()
            ->where('slug', $slug)
            ->with(['postCategory', 'createdBy.profile'])
            ->firstOrFail();

        $post->increment('views');

        $relatedPosts = Post::published()
            ->where('post_category_id', $post->post_category_id)
            ->where('id', '!=', $post->id)
            ->recent(3)
            ->get()
            ->map(fn (Post $p) => $this->transformPost($p));

        return Inertia::render('Public/BlogDetail', [
            'post' => $this->transformPost($post, withContent: true),
            'relatedPosts' => $relatedPosts,
            'categories' => PostCategory::active()->ordered()->get(['id', 'name', 'slug']),
            'archives' => $this->getArchives(),
            'tags' => $this->getTags(),
            'recentPosts' => Post::published()->recent(5)->get()->map(fn (Post $p) => $this->transformPost($p)),
        ]);
    }

    private function transformPost(Post $post, bool $withContent = false): array
    {
        $profile = $post->createdBy?->profile;

        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'thumbnail' => $post->thumbnail,
            'tags' => $post->tags ?? [],
            'views' => $post->views,
            'published_at' => $post->published_at?->format('Y-m-d'),
            'category' => $post->postCategory ? [
                'id' => $post->postCategory->id,
                'name' => $post->postCategory->name,
                'slug' => $post->postCategory->slug,
            ] : null,
            'author' => [
                'name' => $profile?->full_name ?: ($post->createdBy?->email ?? 'スタッフ'),
                'avatar_url' => $profile?->avatar_url,
                'bio' => $profile?->bio,
            ],
            ...($withContent ? ['content' => $post->content] : []),
        ];
    }

    private function getArchives(): Collection
    {
        return Post::published()
            ->selectRaw('YEAR(published_at) as year, MONTH(published_at) as month, COUNT(*) as count')
            ->groupBy('year', 'month')
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->get();
    }

    private function getTags(): Collection
    {
        return Post::published()
            ->whereNotNull('tags')
            ->pluck('tags')
            ->flatten()
            ->unique()
            ->values();
    }
}
