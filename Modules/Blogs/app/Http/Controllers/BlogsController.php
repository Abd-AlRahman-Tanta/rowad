<?php

namespace Modules\Blogs\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Blogs\Models\Blog;
use Modules\Blogs\Transformers\BlogResource;
use Modules\Shared\Models\Content;

class BlogsController extends Controller
{
  public function index()
  {
    $content = Content::firstWhere('page_name', 'BlogsPage')?->data;
    $blogsPagination = Blog::where('published', true)
      ->latest()
      ->paginate(9);

    $blogsData = BlogResource::blogPaginateResource(
      $blogsPagination,
      ['title', 'summary', 'image', 'category', 'readTime', 'created_at']
    );

    return Inertia::render('BlogsPage', [
      'allData' => [
        'data'  => $content,
        'blogs' => $blogsData['blogs'],
        'links' => $blogsData['links'],
      ],
    ]);
  }

  public function show($id)
  {
    $content = Content::firstWhere('page_name', 'BlogsPage')?->data;

    $blog = (new BlogResource(Blog::findOrFail($id)))->resolve();

    $moreBlogsPagination = Blog::where('published', true)
      ->where('id', '!=', $id)
      ->latest()
      ->paginate(3);

    $moreBlogs = BlogResource::blogPaginateResource(
      $moreBlogsPagination,
      ['title', 'summary', 'image', 'category', 'readTime', 'created_at']
    );

    return Inertia::render('BlogDetailsPage', [
      'allData' => [
        'data'      => $content,
        'blog'      => $blog,
        'moreBlogs' => $moreBlogs,
      ],
    ]);
  }
}
