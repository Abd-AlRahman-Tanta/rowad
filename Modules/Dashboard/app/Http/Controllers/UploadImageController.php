<?php

namespace Modules\DashboardModule\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadImageController extends Controller
{
  public static function getImagePath($imagePath)
  {
    return ltrim(str_replace('/storage/', '', $imagePath), '/');
  }
  public static function checkForImage($imagePath)
  {
    $path = self::getImagePath($imagePath);
    if (Storage::disk("public")->exists($path))
      return $path;
  }
  public static function uploadImage($file, string $folder = 'images'): string
  {
    if ($file instanceof \Illuminate\Http\UploadedFile) {
      return Storage::url($file->store($folder, 'public'));
    }
    return $file;
  }
  public static function uploadSpatieImage(?array $imageObj, string $folder = 'images'): ?array
  {
    if (!$imageObj) return null;
    return [
      'ar' => isset($imageObj['ar']) ? self::uploadImage($imageObj['ar'], $folder) : null,
      'en' => isset($imageObj['en']) ? self::uploadImage($imageObj['en'], $folder) : null,
    ];
  }
  public static function deleteImage($imagePath)
  {
    if (!$imagePath) {
      return;
    }
    $path = self::checkForImage($imagePath);
    if ($path) {
      Storage::disk('public')->delete($path);
    }
  }
}
