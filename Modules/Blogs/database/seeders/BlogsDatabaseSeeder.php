<?php

namespace Modules\Blogs\Database\Seeders;

use App\Utils\BringJson;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class BlogsDatabaseSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    // Disable foreign key checks if needed
    Schema::disableForeignKeyConstraints();
    DB::table('blogs')->truncate();
    Schema::enableForeignKeyConstraints();

    $jsonFileName = 'Blogs';
    $blogs = BringJson::read($jsonFileName);

    foreach ($blogs as $blog) {
      DB::table('blogs')->insert([
        'image' => $blog['image'],
        'heroImage' => $blog['heroImage'] ?? null,
        'title' => json_encode($blog['title']),
        'summary' => json_encode($blog['summary']),
        'content' => json_encode($blog['content']),
        'category' => $blog['category'] ?? null,
        'readTime' => $blog['readTime'] ?? null,
        'published' => $blog['published'] ?? true,
      ]);
    }
  }
}
