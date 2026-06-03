<?php

namespace Modules\Pages\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Pages\Models\Course;
use Modules\Pages\Transformers\CourseResource;
use Modules\Pages\Transformers\LearningPointResource;
use Modules\Pages\Transformers\TopicResource;
use Modules\Projects\Models\Project;
use Modules\Projects\Transformers\ProjectResource;
use Modules\Shared\Models\Content;

class PagesController extends Controller
{
  public function home()
  {
    $staticData = Content::firstWhere("page_name", "Home")->data;
    $projects = ProjectResource::collection(Project::with("images")->orderBy("id", "desc")->get())->resolve();
    $coursesPagination = Course::select("name", "newCourse", "image", "id")->orderBy("id", "desc")->paginate(3);
    return Inertia::render("Home", [
      "allData" => [
        "data" =>  $staticData,
        "projects" => $projects,
        "coursesData" => CourseResource::coursePaginateResource($coursesPagination, ["name", "newCourse", "image", "id"])
      ]
    ]);
  }
  public function universityServices()
  {
    $data = Content::firstWhere("page_name", "UniversityServices")->data;
    return Inertia::render("Services", [
      "allData" => [
        "data" => $data,
        "serviceName" => "UniversityServices"
      ]
    ]);
  }
  public function engServices()
  {
    $data = Content::firstWhere("page_name", "EngServices")->data;
    return Inertia::render("Services", [
      "allData" => [
        "data" => $data,
        "serviceName" => "EngServices"
      ]
    ]);
  }
  public function ShowCourseDetailsPage(Request $request, $id)
  {
    $course = (new CourseResource(Course::with("learningPoints", "topics", "images")->find($id)))->resolve();
    $coursesPagination = Course::select("name", "newCourse", "image", "id")->where("id", "!=", $id)->paginate(3);
    $data = Content::firstWhere("page_name", "Course")->data;
    return Inertia::render("CourseDetailsPage", [
      "allData" => [
        "data" => $data,
        "course" => $course,
        "moreCourses" => CourseResource::coursePaginateResource($coursesPagination, ["name", "newCourse", "image", "id"])
      ]
    ]);
  }
}
