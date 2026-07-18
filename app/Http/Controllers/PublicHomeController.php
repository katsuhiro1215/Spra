<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Post;
use App\Models\Voice;
use App\Services\ServiceService;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class PublicHomeController extends Controller
{
    public function __construct(
        private ServiceService $serviceService
    ) {}

    /**
     * トップページ
     *
     * Hero/About/CTAの内容はPage/Section(ブロックエディタ)で管理し、
     * 公開サイト側はHeroSection/AboutSection/ContactSectionの専用コンポーネントに
     * データを流し込んで描画する(デザインの作り込みはコンポーネント側に残す)
     */
    public function index(): Response
    {
        $homePage = Page::where('slug', 'home')
            ->with(['sections' => fn ($query) => $query->orderBy('sort_order')])
            ->first();

        return Inertia::render('Public/Home', [
            'canLogin' => Route::has('user.login'),
            'canRegister' => Route::has('user.register'),
            'services' => $this->serviceService->getFeaturedForHome(),
            'hero' => $this->buildHeroProps($homePage),
            'about' => $this->buildAboutProps($homePage),
            'cta' => $this->buildCtaProps($homePage),
            'newsItems' => Post::published()
                ->whereHas('postCategory', fn ($q) => $q->where('slug', 'news'))
                ->with('postCategory')
                ->recent(3)
                ->get()
                ->map($this->summarizePost(...)),
            'blogPosts' => Post::published()
                ->whereHas('postCategory', fn ($q) => $q->where('slug', '!=', 'news'))
                ->with('postCategory')
                ->recent(3)
                ->get()
                ->map($this->summarizePost(...)),
            'voices' => Voice::published()
                ->featured()
                ->with(['service', 'user.profile', 'avatar'])
                ->ordered()
                ->limit(6)
                ->get(),
        ]);
    }

    /**
     * Heroセクション（hero ブロック）→ HeroSection.jsx 用props
     */
    private function buildHeroProps(?Page $homePage): array
    {
        $heroBlock = $homePage?->sections
            ->firstWhere('role', 'hero')
            ?->getBlockData('hero');

        return [
            'images' => $heroBlock['images'] ?? null,
        ];
    }

    /**
     * メインセクション（heading/text/button/cardGroup ブロック）→ AboutSection.jsx 用props
     */
    private function buildAboutProps(?Page $homePage): array
    {
        $aboutSection = $homePage?->sections->firstWhere('role', 'main');

        $heading = $aboutSection?->getBlockData('heading');
        $text = $aboutSection?->getBlockData('text');
        $button = $aboutSection?->getBlockData('button');
        $cardGroup = $aboutSection?->getBlockData('cardGroup');

        return [
            'heading' => $heading['text'] ?? null,
            'description' => strip_tags($text['html'] ?? ''),
            'buttonLabel' => $button['label'] ?? null,
            'buttonUrl' => $button['url'] ?? null,
            'cards' => $cardGroup['items'] ?? null,
        ];
    }

    /**
     * CTAセクション（cta ブロック）→ ContactSection.jsx 用props
     */
    private function buildCtaProps(?Page $homePage): array
    {
        $ctaBlock = $homePage?->sections
            ->firstWhere('role', 'cta')
            ?->getBlockData('cta');

        return [
            'heading' => $ctaBlock['heading'] ?? null,
            'description' => $ctaBlock['text'] ?? null,
            'buttonLabel' => $ctaBlock['buttonLabel'] ?? null,
            'buttonUrl' => $ctaBlock['buttonUrl'] ?? null,
        ];
    }

    private function summarizePost(Post $post): array
    {
        return [
            'id' => $post->id,
            'slug' => $post->slug,
            'title' => $post->title,
            'category' => $post->postCategory?->name,
            'date' => $post->published_at?->format('Y.m.d'),
            'excerpt' => $post->excerpt,
            'image' => $post->thumbnail,
        ];
    }
}
