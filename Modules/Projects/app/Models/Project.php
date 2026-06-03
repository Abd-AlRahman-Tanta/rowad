<?php

namespace Modules\Projects\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Translatable\HasTranslations;

// use Modules\Projects\Database\Factories\ProjectFactory;

class Project extends Model
{
  use HasFactory;
  use HasTranslations;
  protected $table = "projects";
  protected $translatable = ["name", "description"];
  protected $fillable = ["name", "description"];
  protected $casts = [
    "name" => "json",
    "description" => "json",
  ];
  public function images()
  {
    return $this->morphMany(Images::class, 'imageable');
  }
}
