<?php

namespace Modules\Shared\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;
use Modules\Shared\Models\Content;

class SharedController extends Controller
{
  public function update(Request $request)
  {
    $locale = LaravelLocalization::getCurrentLocale();
    $content = Content::firstWhere('page_name', $request->page_name);
    $data = $content->getTranslation('data', $locale);
    $fields = $request->except(['page_name', 'path']);
    $object = [];
    foreach ($fields as $key => $value) {
      if ($request->hasFile($key)) {
        $path = $request->file($key)->store('images', 'public');
        $object[$key] = Storage::url($path) ?? "";
      } else {
        $object[$key] = $value ?? "";
      }
    }
    $current = data_get($data, $request->path);
    // if path contains object → merge
    if (is_array($current)) {
      $value = array_merge($current, $object);
    }
    // if single value
    else {
      $value = reset($object);
    }
    data_set($data, $request->path, $value);
    $content->setTranslation('data', $locale, $data);
    $content->save();
    return response()->json('success');
  }

  public function addElement(Request $request)
  {
    $locale = LaravelLocalization::getCurrentLocale();
    $content = Content::firstWhere('page_name', $request->page_name);
    $data = $content->getTranslation('data', $locale);
    $array = data_get($data, $request->path) ?? [];
    $newItem = $request->except(['page_name', 'path']);
    foreach ($newItem as $key => $value) {
      if ($request->hasFile($key)) {
        $path = $request->file($key)->store("images", "public");
        $newItem[$key] = Storage::url($path);
      }
    }
    $first = $array[0] ?? null;
    if (is_array($first)) {
      foreach ($first as $key => $value) {
        if (is_array($value)) {
          $newItem[$key] = array(reset($value));
        }
      }
      $array[] = $newItem;
    } else {
      $array[] = reset($newItem);
    }
    data_set($data, $request->path, $array);
    $content->setTranslation('data', $locale, $data);
    $content->save();
    return response()->json(['success' => true]);
  }

  public function deleteElement(Request $request)
  {
    $locale = LaravelLocalization::getCurrentLocale();
    $content = DB::table("contents")->where('page_name', $request->page_name)->first();
    $data = json_decode($content->data, true);
    $segments = explode('.', $request->path);
    $removedIndex = array_pop($segments);
    $ref = &$data[$locale];
    foreach ($segments as $segment) {
      $ref = &$ref[$segment];
    }
    if (isset($ref[$removedIndex]))
      array_splice($ref, $removedIndex, 1);
    DB::table("contents")->where('page_name', $request->page_name)->update([
      "data" => json_encode($data,  JSON_UNESCAPED_UNICODE)
    ]);
    return response()->json(['success' => true]);
  }

  public function uploadFile(Request $request)
  {
    // Handle both CKEditor ('upload') and custom ('file')
    $fileKey = $request->hasFile('upload') ? 'upload' : ($request->hasFile('file') ? 'file' : null);
    if (!$fileKey) {
      return response()->json([
        'uploaded' => false,
        'error' => ['message' => 'No file provided']
      ], 400);
    }

    try {
      // Store in 'uploads' or customize (e.g., 'images' for images)
      $path = $request->file($fileKey)->store('uploads', 'public');
      $url = Storage::url($path);

      // Response format compatible with CKEditor and your custom plugin
      return response()->json([
        'uploaded' => true,
        'url' => $url
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'uploaded' => false,
        'error' => ['message' => $e->getMessage()]
      ], 500);
    }
  }
}
