<?php

namespace Modules\Pages\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Translatable\HasTranslations;

// use Modules\Pages\Database\Factories\DetailFactory;

class Topic extends Model
{
  use HasFactory;
  use HasTranslations;
  protected $table = "topics";
  protected $translatable = ["title"];
  protected $fillable = ["title", "course_id", "type"];
  protected $casts = [
    "title" => "json"
  ];
  public function course()
  {
    return $this->belongsTo(Course::class);
  }
}
