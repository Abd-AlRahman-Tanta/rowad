<?php

namespace Modules\Shared\Database\Seeders;

use App\Utils\BringJson;
use Illuminate\Database\Seeder;
use Modules\Shared\Models\Content;

class SharedDatabaseSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    // first json file...ssecond is page name
    $page = [
      "Global" => "Global",
      "Home" => "Home",
      "Course" => "Course",
      "UniversityServices" => "UniversityServices",
      "EngServices" => "EngServices",
      "DashboardProjectsCrud" => "DashboardProjectsCrud"
    ];
    foreach ($page as $key => $value) {
      $this->seedToDataBase($key, $value);
    }
  }
  public function seedToDataBase($jsonFile, $pageName)
  {
    $jsonFile = BringJson::read($jsonFile);
    Content::create([
      "page_name" => $pageName,
      "data" => [
        "en" => $jsonFile["en"] ?? null,
        "ar" => $jsonFile["ar"] ?? null
      ]
    ]);
  }
}
