<?php

namespace Modules\Projects\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Dashboard\Http\Controllers\DashboardController;
use Modules\Pages\Transformers\ImageResource;
use Modules\Projects\Models\Project;
use Modules\Shared\Models\Content;

class ProjectsController extends Controller
{
  private function projectResource($projects)
  {
    return $projects->map(fn($p) => [
      'id'    => $p['id'],
      'name' => $p['name'],
      'description' => $p['description'],
      'images' => ImageResource::collection($p['images'] ?? [])->resolve(),
      "created_at" => $p['created_at']->format('Y-m-d'),
    ]);
  }
  public function index(Request $request)
  {
    $content = Content::firstWhere("page_name", "DashboardProjectsCrud")->data;
    $query = Project::query()->with('images');
    if ($request->search) {
      $result = DashboardController::applySearchOnly($query, $request);
      return Inertia::render("DashboardProjects", [
        "allData" => [
          "projects" => $this->projectResource($result),
          "links" => [],
          "content" => $content
        ]
      ]);
    }
    $data = $query->paginate(6)->withQueryString();
    return Inertia::render("DashboardProjects", [
      "allData" => [
        "projects" => $this->projectResource($data),
        "links" => $data->toArray()["links"],
        "content" => $content
      ]
    ]);
  }
}
