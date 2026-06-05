<?php

namespace Modules\Pages\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;
use Modules\Dashboard\Http\Controllers\DashboardController;
use Modules\Dashboard\Http\Controllers\UploadImageController;
use Modules\Dashboard\Http\Requests\CourseRequest;
use Modules\Pages\Models\Course;
use Modules\Pages\Transformers\CourseResource;
use Modules\Shared\Models\Content;

class CoursesController extends Controller
{
  private function courseResource($courses)
  {
    return $courses->map(fn($c) => [
      'id'    => $c['id'],
      'name' => $c['name'],
      'newCourse' => $c['newCourse'],
      'image' => $c['image'],
    ]);
  }
  public function index(Request $request)
  {
    $content = Content::firstWhere("page_name", "DashboardCoursesCrud")->data;
    $courseQuery = Course::query();
    if ($request->search) {
      $result = DashboardController::applySearchOnly($courseQuery, $request);
      return Inertia::render("DashboardCourses", [
        "allData" => [
          "courses" => $this->courseResource($result),
          "links" => [],
          "content" => $content
        ]
      ]);
    }
    $coursesPagination = $courseQuery->select("name", "newCourse", "image", "id")->paginate(6);
    $coursesData = CourseResource::coursePaginateResource($coursesPagination, ["name", "newCourse", "image", "id"]);
    return Inertia::render("DashboardCourses", [
      "allData" => [
        "courses" => $coursesData["courses"],
        "links" => $coursesData["links"],
        "content" => $content
      ]
    ]);
  }
  public function edit(Request $request, Course $id)
  {
    $content = Content::firstWhere("page_name", "DashboardCoursesCrud")->data;
    $course = $id;
    $course->load(["learningPoints", "topics", "images"]);
    $courseArray = $course->toArray();
    $courseArray["learningPoints"] = $courseArray["learning_points"];
    unset($courseArray["learning_points"]);
    return Inertia::render("DashboardCoursesCrud", [
      "allData" => [
        "content" => $content,
        "course" => $courseArray,
        "isEdit" => true
      ]
    ]);
  }
  public function create()
  {
    $content = Content::firstWhere("page_name", "DashboardCoursesCrud")->data;
    return Inertia::render("DashboardCoursesCrud", [
      "allData" => [
        "content" => $content,
        "isEdit" => false
      ]
    ]);
  }
  public function store(CourseRequest $request)
  {
    $validated = $request->validated();
    $course = Course::create([
      'name'        => $validated["name"],
      'description' => $validated["description"],
      'image'       => UploadImageController::uploadImage($validated["image"]),
      'heroImage'   => UploadImageController::uploadImage($validated["heroImage"]),
      'price'       => $validated["price"],
      'newCourse'   => $validated["newCourse"]["val"] == 'true' ? 1 : 0,
    ]);
    $this->syncRelations($course, $validated);
    DashboardController::syncImages($course, $request->file('images', []));
    return response()->json(['message' => 'Course created successfully']);
  }

  public function update(CourseRequest $request, Course $id)
  {
    $validated = $request->validated();
    $course = $id;
    $course->load(["topics", "learningPoints", "images"]);
    $course->update([
      'name'        => $validated["name"],
      'description' => $validated["description"],
      'image'       => $this->handleSingleImage($request, 'image', $course->image, 'images'),
      'heroImage'   => $this->handleSingleImage($request, 'heroImage', $course->heroImage, 'images'),
      'price'       => $validated["price"],
      'newCourse'   => $validated["newCourse"]["val"] == 'true' ? 1 : 0,
    ]);
    $course->learningPoints()->delete();
    $course->topics()->delete();
    $this->syncRelations($course, $request);
    DashboardController::updateSyncImages($course, $validated, $request);
    return response()->json(["message" => "course updated successfully!"]);
  }


  private function handleSingleImage($request, string $field, string $oldPath, string $folder): string
  {
    $file = $request->file($field);
    if ($file instanceof UploadedFile) {
      UploadImageController::deleteImage($oldPath);
      return UploadImageController::uploadImage($file, $folder);
    }
    return $oldPath;
  }
  private function syncRelations(Course $course, $validated): void
  {
    foreach ($validated["learningPoints"] as $point) {
      if (empty($point['title'])) continue;
      $course->learningPoints()->create(['title' => $point['title']]);
    }
    foreach ($validated["topics"] as $topic) {
      if (empty($topic['title'])) continue;
      $course->topics()->create(['title' => $topic['title']]);
    }
  }
}
