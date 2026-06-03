<?php

namespace Modules\Projects\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Projects\Database\Factories\ProjectImagesFactory;

class Images extends Model
{
  use HasFactory;

  /**
   * The attributes that are mass assignable.
   */
  protected $fillable = ['image'];
  protected $table = "images";
  public function imageable()
  {
    return $this->morphTo();
  }
  /**
   * Get the project that owns the image.
   */

  // protected static function newFactory(): ProjectImagesFactory
  // {
  //     // return ProjectImagesFactory::new();
  // }
}
