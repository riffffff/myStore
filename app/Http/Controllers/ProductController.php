<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductService $productService
    ) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['stock_status', 'sort', 'search']);
        $products = $this->productService->getPublishedProducts($filters, 12);

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => $filters,
        ]);
    }

    public function show(string $slug): Response
    {
        $product = $this->productService->getProductBySlug($slug);

        // Track view count
        $this->productService->incrementProductView($product);

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }
}
