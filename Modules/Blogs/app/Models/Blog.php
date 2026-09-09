<?php

namespace Modules\Blogs\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Translatable\HasTranslations;

// use Modules\Blogs\Database\Factories\BlogFactory;

class Blog extends Model
{
  use HasFactory;
  use HasTranslations;
  protected $fillable = [
    'image',
    'heroImage',
    'title',
    'summary',
    'content',
    'category',
    'readTime',
    'published',
  ];
  public $table = "blogs";
  public array $translatable = ['title', 'summary', 'content'];
  protected $casts = [
    'published' => 'boolean',
    'title' => 'json',
    'summary' => 'json',
    'content' => 'json',
  ];
}
