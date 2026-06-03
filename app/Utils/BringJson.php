<?php

namespace App\Utils;

use Exception;

class BringJson
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
}
