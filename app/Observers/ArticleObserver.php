<?php

namespace App\Observers;

use App\Models\Article;
use App\Services\ImageService;

class ArticleObserver
{
    protected array $oldPaths = [];

    public function __construct(
        protected ImageService $imageService
    ) {}

    public function updating(Article $article): void
    {
        $this->oldPaths = [];
        $fields = ['image'];

        foreach ($fields as $field) {
            if ($article->isDirty($field)) {
                $oldValue = $article->getOriginal($field);
                $newValue = $article->getAttribute($field);
                if (
                    !empty($oldValue)
                    && $oldValue !== $newValue
                ) {
                    $this->oldPaths[$field] = $oldValue;
                }
            }
        }
    }

    public function saved(Article $article): void
    {
        foreach ($this->oldPaths as $oldPath) {
            try {
                $this->imageService->deleteIfExists($oldPath);
            } catch (\Throwable) {
            }
        }
        $this->oldPaths = [];
    }

    public function deleted(Article $article): void
    {
        if (!empty($article->image)) {
            try {
                $this->imageService->deleteIfExists($article->image);
            } catch (\Throwable) {
            }
        }
    }
}
