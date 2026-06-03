<?php

namespace Modules\Pages\Transformers;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   */
  public function toArray(Request $request): array
  {
    return [
      "id" => $this->id,
      "name" => $this->name,
      "description" => $this->description,
      "image" => $this->image,
      "heroImage" => $this->heroImage,
      "price" => $this->price,
      "newCourse" => $this->newCourse,
      "learningPoints" => LearningPointResource::collection($this->learningPoints)->resolve(),
      "topics" => TopicResource::collection($this->topics)->resolve(),
      "images" => ImageResource::collection($this->images)->resolve()
    ];
  }
  public static function coursePaginateResource($courses, $only = null)
  {
    $links = $courses->toArray()["links"];
    $courses = $courses->through(function ($course) use ($only) {
      if ($only) {
        $filtered = [];
        foreach ($only as $field) {
          $filtered[$field] = $course->$field;
        }
        return $filtered;
      }
      return [
        "id" => $course->id,
        "name" => $course->name,
        "description" => $course->description,
        "image" => $course->image,
        "heroImage" => $course->heroImage,
        "price" => $course->price,
        "newCourse" => $course->newCourse,
        "learningPoints" => LearningPointResource::collection(
          $course->learningPoints
        )->resolve(),
        "topics" => TopicResource::collection(
          $course->topics
        )->resolve(),
      ];
    })->toArray()["data"];
    return [
      "courses" => $courses,
      "links" => $links
    ];
  }
}
