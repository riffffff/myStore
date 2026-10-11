<?php

namespace App\Http\Controllers;

use App\Services\ArticleService;
use App\Services\ProductService;
use App\Services\ReviewService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private readonly ArticleService $articleService,
        private readonly ProductService $productService,
        private readonly ReviewService $reviewService
    ) {}

    public function __invoke(): Response
    {
        $heroArticles = $this->articleService->getHeroArticles();
        $topProducts = $this->productService->getTopProducts(8);
        $reviews = $this->reviewService->getApprovedReviews(9);

        return Inertia::render('Home', [
            'heroArticles' => $heroArticles,
            'topProducts' => $topProducts,
            'reviews' => $reviews,
        ]);
    }
}
