<?php

namespace Modules\Projects\Transformers;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Modules\Pages\Transformers\ImageResource;

class ProjectResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   */
  public function toArray(Request $request): array
  {
    return [
      "name" => $this->name,
      "description" => $this->description,
      "images" => ImageResource::collection($this->images)->resolve(),
      "created_at" => $this->created_at->format('Y-m-d'),
    ];
  }
}
