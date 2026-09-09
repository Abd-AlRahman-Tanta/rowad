<?php

namespace Modules\Projects\Database\Seeders;

use App\Utils\BringJson;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Modules\Pages\Models\Course;
use Modules\Pages\Models\LearningPoint;
use Modules\Pages\Models\Topic;
use Modules\Projects\Models\Project;

class ProjectsDatabaseSeeder extends Seeder
{
  public function run(): void
  {
    // تنظيف البيانات القديمة
    Schema::disableForeignKeyConstraints();
    DB::table('images')->truncate();
    DB::table('projects')->truncate();
    DB::table('courses')->truncate();
    DB::table('topics')->truncate();
    DB::table('learning_points')->truncate();
    Schema::enableForeignKeyConstraints();

    // seed projects
    $projects = BringJson::read("Projects");
    foreach ($projects as $project) {
      $newProject = Project::create([
        "name" => [
          "ar" => $project["name"]["ar"],
          "en" => $project["name"]["en"]
        ],
        "description" => [
          "ar" => $project["description"]["ar"],
          "en" => $project["description"]["en"]
        ],
      ]);

      if (!empty($project["images"])) {
        $newProject->images()->createMany(
          collect($project["images"])->map(function ($image) {
            return ["image" => $image["image"]];
          })->toArray()
        );
      }
    }

    // seed courses
    $courses = BringJson::read("Courses");
    foreach ($courses as $course) {
      $newCourse = Course::create([
        "name"        => ["ar" => $course["name"]["ar"], "en" => $course["name"]["en"]],
        "description" => ["ar" => $course["description"]["ar"], "en" => $course["description"]["en"]],
        "image"       => $course["image"],
        "heroImage"   => $course["heroImage"],
        "price"       => $course["price"] ?? null,
        "new_price"   => $course["new_price"] ?? null,
        "newCourse"   => $course["newCourse"] ?? true,
      ]);

      // images
      if (!empty($course["images"])) {
        $newCourse->images()->createMany(
          collect($course["images"])->map(function ($image) {
            return ["image" => $image["image"]];
          })->toArray()
        );
      }

      // topics
      if (!empty($course["topics"])) {
        $newCourse->topics()->createMany(
          collect($course["topics"])->map(function ($topic) {
            return [
              "title" => [
                "ar" => $topic["title"]["ar"],
                "en" => $topic["title"]["en"]
              ],
            ];
          })->toArray()
        );
      }

      // learning points
      if (!empty($course["learningPoints"])) {
        $newCourse->learningPoints()->createMany(
          collect($course["learningPoints"])->map(function ($point) {
            return [
              "title" => [
                "ar" => $point["title"]["ar"],
                "en" => $point["title"]["en"]
              ],
            ];
          })->toArray()
        );
      }
    }
  }
}
