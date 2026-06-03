<?php

namespace Modules\Projects\Database\Seeders;

use App\Utils\BringJson;
use Illuminate\Database\Seeder;
use Modules\Pages\Models\Course;
use Modules\Projects\Models\Project;

class ProjectsDatabaseSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
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
      $newProject->images()
        ->createMany(
          collect($project["images"])->map(function ($image) {
            return ["image" => $image];
          })->toArray()
        );
    }
    $courses = BringJson::read("Courses");
    foreach ($courses as $course) {
      $newCourse = Course::create([
        "name" => ["ar" => $course["name"]["ar"], "en" => $course["name"]["en"]],
        "description" => ["ar" => $course["description"]["ar"], "en" => $course["description"]["en"]],
        "image" => $course["image"],
        "heroImage" => $course["heroImage"],
        "price" => $course["price"],
        "newCourse" => $course["newCourse"] ?? true,
      ]);
      $newCourse->images()
        ->createMany(array_map(function ($image) {
          return ["image" => $image];
        }, $course["images"]));
      $newCourse->topics()->createMany(
        collect($course["course_topics"])->map(function ($topic) {
          return [
            "title" => ["ar" => $topic["title"]["ar"], "en" => $topic["title"]["en"]],
          ];
        })->toArray()
      );
      $newCourse->learningPoints()->createMany(
        collect($course["learning_outcomes"])->map(function ($point) {
          return [
            "title" => ["ar" => $point["title"]["ar"], "en" => $point["title"]["en"]],
          ];
        })->toArray()
      );
    }
  }
}
