<?php

namespace Modules\DashboardModule\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UploadVideoController extends Controller
{

  public static function getVideoPath($videoPath)
  {
    return ltrim(str_replace('/storage/', '', $videoPath), '/');
  }

  public static function checkForVideo($videoPath)
  {
    $path = self::getVideoPath($videoPath);

    if (Storage::disk('public')->exists($path)) {
      return $path;
    }

    return null;
  }

  public static function uploadVideo($file, string $folder = 'videos'): string
  {
    if ($file instanceof UploadedFile) {
      return Storage::url($file->store($folder, 'public'));
    }
    return $file;
  }

  public static function deleteVideo($videoPath)
  {
    if (!$videoPath) {
      return;
    }

    $path = self::checkForVideo($videoPath);

    if ($path) {
      Storage::disk('public')->delete($path);
    }
  }
}
