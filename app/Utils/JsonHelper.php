<?php

namespace App\Utils;

use Exception;

class JsonHelper
{
  public static function read($filePath)
  {
    if (!str_ends_with(strtolower($filePath), '.json')) {
      $filePath .= '.json';
    }

    $fullPath = storage_path('app/private/json/' . $filePath);

    if (!file_exists($fullPath)) {
      throw new Exception("JSON file not found: {$filePath}");
    }

    return json_decode(file_get_contents($fullPath), true);
  }

  public static function write($filePath, array $data)
  {
    if (!str_ends_with(strtolower($filePath), '.json')) {
      $filePath .= '.json';
    }

    $fullPath = storage_path('app/private/json/' . $filePath);

    file_put_contents(
      $fullPath,
      json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
    );
  }
}
