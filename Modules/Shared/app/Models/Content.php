<?php

namespace Modules\Shared\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Translatable\HasTranslations;

// use Modules\Pages\Database\Factories\ContentFactory;

class Content extends Model
{
  use HasFactory;
  use HasTranslations;
  protected $table = "contents";
  protected $translatable = ["data"];
  protected $fillable = ["page_name", "data"];
  protected $casts = ["data" => "json"];
}
