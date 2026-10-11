<?php

namespace App\Http\Controllers;

use App\Services\ArticleService;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function __construct(
        private readonly ArticleService $articleService
    ) {}

    public function index(): Response
    {
        $articles = $this->articleService->getPublishedArticles(9);

        return Inertia::render('Articles/Index', [
            'articles' => $articles,
        ]);
    }

    public function show(string $slug): Response
    {
        $article = $this->articleService->getArticleBySlug($slug);

        // Track view count
        $this->articleService->incrementArticleView($article);

        return Inertia::render('Articles/Show', [
            'article' => $article,
        ]);
    }
}
