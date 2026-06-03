<?php

namespace Modules\Shared\Transformers;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StaticDataContentAndServiceResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   */
  public function toArray(Request $request): array
  {
    return [
      "data" => $this->data
    ];
  }
}
