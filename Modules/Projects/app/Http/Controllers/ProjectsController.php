<?php

namespace Modules\Projects\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;
use Modules\Dashboard\Http\Controllers\DashboardController;
use Modules\Dashboard\Http\Controllers\UploadImageController;
use Modules\Dashboard\Http\Requests\ProjectRequest;
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
  public function create(Request $request)
  {
    $content = Content::firstWhere("page_name", "DashboardProjectsCrud")->data;
    return Inertia::render("DashboardProjectsCrud", [
      "allData" => [
        "content" => $content,
        "isEdit" => false
      ]
    ]);
  }
  public function edit(Request $request, Project $id)
  {
    $content = Content::firstWhere("page_name", "DashboardProjectsCrud")->data;
    $project = $id;
    $project->load("images");
    return Inertia::render("DashboardProjectsCrud", [
      "allData" => [
        "project" => $project,
        "content" => $content,
        "isEdit" => true
      ]
    ]);
  }
  public function store(ProjectRequest $request)
  {
    $validated = $request->validated();

    $project = Project::create([
      'name'        => $validated['name'],
      'description' => $validated['description']
    ]);
    DashboardController::syncImages($project, $request->file('images', []));
    return response()->json(['message' => 'Project created successfully']);
  }
  public function update(ProjectRequest $request, Project $id)
  {
    $validated = $request->validated();
    $project = $id;
    $project->load("images");
    $project->update([
      'name'        => $validated['name'],
      'description' => $validated['description'],
    ]);
    DashboardController::updateSyncImages($project, $validated, $request);
    return response()->json(['message' => 'porject updated successfully!']);
  }
  public function destroy(Request $request, Project $id)
  {
    $project = $id;
    $project->load("images");
    foreach ($project->images as $img) {
      UploadImageController::deleteImage($img->image);
    }
    $project->images()->delete();
    $project->delete();

    return response()->json(["message" => "project Deleted!"]);
  }
}
