<?php

namespace Modules\Dashboard\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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
}
