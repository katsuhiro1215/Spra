<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\FaqCategory;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    /**
     * よくある質問（公開中のFAQを、公開サイトと同じ条件でカテゴリー別に表示）
     */
    public function index(): Response
    {
        $categories = FaqCategory::active()
            ->ordered()
            ->with(['publishedFaqs'])
            ->get()
            ->filter(fn (FaqCategory $category) => $category->publishedFaqs->isNotEmpty())
            ->values();

        return Inertia::render('User/Faqs/Index', [
            'categories' => $categories,
        ]);
    }
}
