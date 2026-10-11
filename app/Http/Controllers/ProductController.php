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
        $filters = $request->only(['stock_status', 'category', 'sort', 'search', 'min_price', 'max_price', 'per_page']);
        
        $perPage = (int) $request->input('per_page', 6);
        $allowedPerPage = [3, 6, 12, 24, 48];
        if (! in_array($perPage, $allowedPerPage, true)) {
            $perPage = 6;
        }

        $products = $this->productService->getPublishedProducts($filters, $perPage);
        $categories = $this->productService->getCategories();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => array_merge($filters, ['per_page' => $perPage]),
            'categories' => $categories,
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
