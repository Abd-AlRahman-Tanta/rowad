<?php

namespace Modules\Dashboard\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

class DashboardController extends Controller
{
  public static function applySearchOnly($query, $request)
  {
    $search = $request->search;
    $fields = json_decode($request->searchFields ?? '[]', true);
    $query->where(function ($q) use ($fields, $search) {
      foreach ($fields as $field) {
        $translatable = filter_var($field['translatable'] ?? false, FILTER_VALIDATE_BOOLEAN);
        if ($translatable) {
          $q->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(`{$field['name']}`, '$.ar'))) LIKE ?", ["%" . strtolower($search) . "%"])
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(`{$field['name']}`, '$.en'))) LIKE ?", ["%" . strtolower($search) . "%"]);
        } else {
          $q->orWhereRaw("LOWER(`{$field['name']}`) LIKE ?", ["%" . strtolower($search) . "%"]);
        }
      }
    });
    return $query->get();
  }
  public static function modifiyFields($content, $choices)
  {
    $modifiedFields = collect($content['inputs'])->map(function ($field) use ($choices) {
      foreach ($choices as $name => $selectChoices) {
        if ($field['name'] == $name) {
          $opts = ['selectChoices' => $selectChoices];
          $field = array_merge($field, $opts);
        }
      }
      return $field;
    })->toArray();
    return $modifiedFields;
  }
  public static function updateSyncImages(Model $model, $validated, $request)
  {
    $oldUrls = $model->images ? $model->images->pluck('image')->toArray() : [];
    $keptUrls = [];
    if (isset($validated["images"])) {
      foreach ($validated["images"] as $key => $item) {
        $file = $request->file("images.{$key}.image");
        if ($file instanceof UploadedFile) {
          $path = UploadImageController::uploadImage($file);
          $model->images()->create(['image' => $path]);
        } elseif (isset($item['image']) && is_string($item['image'])) {
          $keptUrls[] = $item['image'];
        }
      }
      foreach ($oldUrls as $oldUrl) {
        if (!in_array($oldUrl, $keptUrls)) {
          UploadImageController::deleteImage($oldUrl);
          $model->images()->where('image', $oldUrl)->delete();
        }
      }
    } else {
      if ($model->images) {
        foreach ($model->images as $image) {
          UploadImageController::deleteImage($image->image);
        }
        $model->images()->delete();
      }
    }
  }
  public static function syncImages(Model $model, array $files): void
  {
    foreach ($files as $file) {
      if (!$file) continue;
      $path = UploadImageController::uploadImage($file['image']);
      $model->images()->create(['image' => $path]);
    }
  }
}
