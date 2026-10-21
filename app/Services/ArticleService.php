<?php

namespace App\Services;

use App\Models\Article;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Service for article-related business logic.
 *
 * Handles article listing, retrieval, and view tracking.
 */
class ArticleService
{
    /**
     * Get published articles with pagination.
     */
    public function getPublishedArticles(int $perPage = 9): LengthAwarePaginator
    {
        return Article::published()
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get single article by slug.
     *
     * @throws ModelNotFoundException
     */
    public function getArticleBySlug(string $slug): Article
    {
        return Article::where('slug', $slug)
            ->published()
            ->firstOrFail();
    }

    /**
     * Increment article view count.
     */
    public function incrementArticleView(Article $article): void
    {
        $article->incrementView();
    }

    /**
     * Get hero articles for homepage.
     */
    public function getHeroArticles(): Collection
    {
        return Article::hero()->get();
    }
}
