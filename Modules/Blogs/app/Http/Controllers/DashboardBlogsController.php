<?php

namespace Modules\Blogs\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Modules\Blogs\Http\Requests\BlogRequest;
use Modules\Blogs\Models\Blog;
use Modules\Blogs\Transformers\BlogResource;
use Modules\Dashboard\Http\Controllers\DashboardController;
use Modules\Dashboard\Http\Controllers\UploadImageController;
use Modules\Shared\Models\Content;

class DashboardBlogsController extends Controller
{
  public function index(Request $request)
  {
    $content = Content::firstWhere('page_name', 'DashboardBlogs')?->data;
    $query = Blog::latest();

    if ($request->filled('search')) {
      $results = DashboardController::applySearchOnly($query, $request);
      $blogsData = BlogResource::blogPaginateResource(
        $results,
        ['title', 'image', 'category', 'published', 'created_at']
      );
      return Inertia::render('DashboardBlogs', [
        'allData' => [
          'blogs'   => $blogsData['blogs'],
          'links'   => [],
          'content' => $content,
        ],
      ]);
    }

    $blogsPagination = $query->paginate(10);
    $blogsData = BlogResource::blogPaginateResource(
      $blogsPagination,
      ['title', 'image', 'category', 'published', 'created_at']
    );

    return Inertia::render('DashboardBlogs', [
      'allData' => [
        'blogs'   => $blogsData['blogs'],
        'links'   => $blogsData['links'],
        'content' => $content,
      ],
    ]);
  }

  public function create()
  {
    $content = Content::firstWhere('page_name', 'DashboardBlogsCrud')?->data;
    return Inertia::render('DashboardBlogsCrud', [
      'allData' => [
        'isEdit'  => false,
        'content' => $content,
        'blog'    => null,
      ],
    ]);
  }

  public function edit(Blog $id)
  {
    $content = Content::firstWhere('page_name', 'DashboardBlogsCrud')?->data;
    $blog = (new BlogResource($id))->resolve();
    return Inertia::render('DashboardBlogsCrud', [
      'allData' => [
        'isEdit'  => true,
        'content' => $content,
        'blog'    => $blog,
      ],
    ]);
  }

  public function store(BlogRequest $request)
  {
    $validated = $request->validated();

    $validated['image']     = UploadImageController::uploadImage($request->file('image'));
    $validated['heroImage'] = $request->hasFile('heroImage')
      ? UploadImageController::uploadImage($request->file('heroImage'))
      : null;

    $validated['published'] = $request->input('published.val') === '1';

    Blog::create($validated);

    return response()->json(['message' => 'Blog created successfully']);
  }

  public function update(BlogRequest $request, Blog $id)
  {
    $validated = $request->validated();

    if ($request->hasFile('image')) {
      UploadImageController::deleteImage($id->image);
      $validated['image'] = UploadImageController::uploadImage($request->file('image'));
    } else {
      unset($validated['image']);
    }

    if ($request->hasFile('heroImage')) {
      if ($id->heroImage) UploadImageController::deleteImage($id->heroImage);
      $validated['heroImage'] = UploadImageController::uploadImage($request->file('heroImage'));
    } else {
      unset($validated['heroImage']);
    }

    $validated['published'] = $request->input('published.val') === '1';

    $id->update($validated);

    return response()->json(['message' => 'Blog updated successfully']);
  }

  public function destroy(Blog $id)
  {
    UploadImageController::deleteImage($id->image);
    if ($id->heroImage) UploadImageController::deleteImage($id->heroImage);
    $id->delete();

    return response()->json(['message' => 'Blog deleted successfully']);
  }
}
