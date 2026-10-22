<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Article::count('*') > 0) {
            return;
        }

        $articlesData = [
            [
                'title' => 'Lorem Ipsum Dolor Sit Amet Consectetur',
                'content' => '<h2>Lorem Ipsum Dolor Sit Amet</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum:</p><ul><li>Sed ut perspiciatis unde omnis iste natus error sit voluptatem</li><li>Accusantium doloremque laudantium totam rem aperiam eaque ipsa</li><li>Quae ab illo inventore veritatis et quasi architecto beatae vitae dicta</li><li>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit</li></ul><p>Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.</p>',
                'excerpt' => 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                'image' => 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
                'is_hero' => true,
                'is_published' => true,
                'published_at' => now(),
            ],
            [
                'title' => 'Adipiscing Elit Sed Do Eiusmod Tempor',
                'content' => '<h2>Consectetur Adipiscing Elit</h2><p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p><p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Indicators lorem ipsum dolor sit amet:</p><ul><li>Consectetur adipiscing elit sed do eiusmod tempor incididunt</li><li>Ut labore et dolore magna aliqua enim ad minim veniam</li><li>Quis nostrud exercitation ullamco laboris nisi ut aliquip</li><li>Ex ea commodo consequat duis aute irure dolor in reprehenderit</li></ul><p>In voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident.</p>',
                'excerpt' => 'Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                'image' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200',
                'is_hero' => true,
                'is_published' => true,
                'published_at' => now()->subDay(),
            ],
            [
                'title' => 'Incididunt Ut Labore Et Dolore Magna Aliqua',
                'content' => '<h2>Sed Do Eiusmod Tempor Incididunt</h2><p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Best practices lorem ipsum dolor sit amet:</p><ul><li>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do</li><li>Eiusmod tempor incididunt ut labore et dolore magna aliqua enim</li><li>Ad minim veniam quis nostrud exercitation ullamco laboris nisi ut</li><li>Aliquip ex ea commodo consequat duis aute irure dolor in</li><li>Reprehenderit in voluptate velit esse cillum dolore eu fugiat</li></ul><p>Nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
                'excerpt' => 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
                'image' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200',
                'is_hero' => true,
                'is_published' => true,
                'published_at' => now()->subDays(2),
            ],
        ];

        foreach ($articlesData as $art) {
            Article::create([
                'title' => $art['title'],
                'slug' => Str::slug($art['title']),
                'content' => $art['content'],
                'excerpt' => $art['excerpt'],
                'image' => $art['image'],
                'is_hero' => $art['is_hero'],
                'is_published' => $art['is_published'],
                'published_at' => $art['published_at'],
            ]);
        }
    }
}
