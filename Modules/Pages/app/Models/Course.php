<?php

namespace Modules\Pages\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Projects\Models\Images;
use Spatie\Translatable\HasTranslations;

// use Modules\Pages\Database\Factories\CourseFactory;

class Course extends Model
{
  use HasFactory;
  use HasTranslations;
  protected $table = "courses";
  protected $translatable = ['name', 'description'];
  protected $fillable = ['name', 'description', 'image', 'heroImage', 'price', 'newCourse'];
  protected $casts = [
    'name' => 'array',
    'description' => 'array',
    'newCourse' => 'boolean'
  ];
  public function images()
  {
    return $this->morphMany(Images::class, 'imageable');
  }
  public function topics()
  {
    return $this->hasMany(Topic::class);
  }
  public function learningPoints()
  {
    return $this->hasMany(LearningPoint::class);
  }
}
