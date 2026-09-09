<?php

namespace Modules\Blogs\Transformers;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogResource extends JsonResource
{
  public function toArray(Request $request): array
  {
    return [
      'id'         => $this->id,
      'image'      => $this->image,
      'heroImage'  => $this->heroImage,
      'title'      => $this->getTranslations('title'),
      'summary'    => $this->getTranslations('summary'),
      'content'    => $this->getTranslations('content'),
      'category'   => $this->category,
      'readTime'   => $this->readTime,
      'published'  => $this->published,
      'created_at' => $this->created_at?->format('Y-m-d'),
    ];
  }

  public static function blogPaginateResource($paginator, array $fields = [])
  {
    $items = $paginator instanceof \Illuminate\Support\Collection
      ? $paginator
      : $paginator->getCollection();

    return [
      'blogs' => $items->map(function ($blog) use ($fields) {
        $data = [
          'id'         => $blog->id,
          'image'      => $blog->image,
          'title'      => $blog->getTranslations('title'),
          'summary'    => $blog->getTranslations('summary'),
          'category'   => $blog->category,
          'readTime'   => $blog->readTime,
          'published'  => $blog->published,
          'created_at' => $blog->created_at?->format('Y-m-d'),
        ];
        return $fields
          ? array_intersect_key($data, array_flip(array_merge(['id'], $fields)))
          : $data;
      }),
      'links' => ($paginator instanceof \Illuminate\Support\Collection)
        ? []
        : ($paginator->links()->toHtml()
          ? $paginator->linkCollection()->toArray()
          : []),
    ];
  }
}
