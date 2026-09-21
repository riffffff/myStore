<?php

namespace App\Http\Controllers;

use App\Http\Requests\Review\StoreReviewRequest;
use App\Services\ReviewService;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
    public function __construct(
        private readonly ReviewService $reviewService
    ) {}

    /**
     * Store a new review with spam protection.
     *
     * Protected by:
     * - Rate limiting (throttle:review middleware in routes)
     * - Honeypot field detection
     * - Product validation
     */
    public function store(StoreReviewRequest $request): RedirectResponse
    {
        // Check if honeypot detected spam
        if ($request->input('is_spam')) {
            // Return fake success to fool bots
            return back()->with('review_submitted', true);
        }

        $this->reviewService->createReview($request->validated());

        return back()->with('review_submitted', true);
    }
}
