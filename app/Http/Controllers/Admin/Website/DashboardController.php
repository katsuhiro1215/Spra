<?php

namespace App\Http\Controllers\Admin\Website;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Page;
use App\Models\PageType;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\Section;
use App\Models\SiteSetting;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'pages' => Page::count(),
            'pageTypes' => PageType::count(),
            'sections' => Section::count(),
            'posts' => Post::count(),
            'publishedPosts' => Post::where('is_published', true)->count(),
            'postCategories' => PostCategory::count(),
            'menus' => Menu::count(),
            'siteSettings' => SiteSetting::count(),
        ];

        return Inertia::render('Admin/Website/Index', [
            'stats' => $stats,
        ]);
    }
}
