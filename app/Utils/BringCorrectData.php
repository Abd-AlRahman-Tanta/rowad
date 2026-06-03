<?php

namespace App\Utils;

use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;
use Modules\PagesModule\Models\Content;

class BringCorrectData
{
    public static function bring($pageName, $table)
    {
        $lang = LaravelLocalization::getCurrentLocale();
        $page = DB::table($table)
            ->where("page_name", $pageName)
            ->where("lang", $lang)
            ->first();
        if (!$page) {
            throw new Exception("Page is Not Found!");
        }
        $data = json_decode($page->data);
        return $data;
    }
}
