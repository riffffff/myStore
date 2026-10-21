<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * @mixin Builder
 * @method static Builder where($column, $operator = null, $value = null, $boolean = 'and')
 */
class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'image',
        'is_hero',
        'is_published',
        'published_at',
        'views_count',
    ];

    protected $casts = [
        'is_hero' => 'boolean',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'views_count' => 'integer',
    ];

    public function setImageAttribute($value): void
    {
        $this->attributes['image'] = is_string($value) ? ltrim($value, '/') : $value;
    }

    /**
     * Increment view counter secara atomic tanpa menyentuh timestamps.
     * Menggunakan DB::table() langsung untuk menghindari race condition.
     */
    public function incrementView(): void
    {
        DB::table($this->getTable())
            ->where('id', $this->id)
            ->increment('views_count');

        // Sync nilai di memory agar konsisten jika model dipakai lagi
        $this->views_count = ($this->views_count ?? 0) + 1;
    }

    public const MAX_HERO_ARTICLES = 3;

    protected static function booted()
    {
        static::creating(function (Article $article) {
            if (empty($article->slug)) {
                $baseSlug = Str::slug($article->title);
                $suffix = Str::random(5);
                $slug = "{$baseSlug}-{$suffix}";
                $counter = 1;
                while (static::where('slug', $slug)->exists()) {
                    $slug = "{$baseSlug}-{$suffix}-{$counter}";
                    $counter++;
                }
                $article->slug = $slug;
            }
        });

        static::updating(function (Article $article) {
            $original = $article->getOriginal();
            if (!empty($original['slug'])) {
                $article->slug = $original['slug'];
            } elseif (empty($article->slug)) {
                $baseSlug = Str::slug($article->title);
                $suffix = Str::random(5);
                $slug = "{$baseSlug}-{$suffix}";
                $counter = 1;
                while (static::where('slug', $slug)->exists()) {
                    $slug = "{$baseSlug}-{$suffix}-{$counter}";
                    $counter++;
                }
                $article->slug = $slug;
            }
        });

        static::saved(function (Article $article) {
            if (!$article->is_hero) {
                return;
            }

            $heroCount = static::where('is_hero', true)->count();
            if ($heroCount <= self::MAX_HERO_ARTICLES) {
                return;
            }

            $excess = $heroCount - self::MAX_HERO_ARTICLES;
            $oldHeroes = static::where('is_hero', true)
                ->orderBy('published_at', 'asc')
                ->orderBy('id', 'asc')
                ->limit($excess)
                ->where('id', '!=', $article->id)
                ->get();

            foreach ($oldHeroes as $old) {
                /** @var Article $old */
                $old->is_hero = false;
                $old->timestamps = false;
                $old->saveQuietly();
            }
        });
    }

    public function scopeHero(Builder $query): Builder
    {
        return $query->where('is_hero', true)
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->limit(self::MAX_HERO_ARTICLES)
            ->orderBy('published_at', 'desc');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderBy('published_at', 'desc');
    }
}
