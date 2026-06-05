<?php

namespace Modules\Dashboard\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;

class ProjectRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'name.ar'                   => 'required|string|max:255',
      'name.en'                   => 'required|string|max:255',
      'description.ar'            => 'required|string',
      'description.en'            => 'required|string',
      'images'                    => 'required|array|min:1',
      'images.*.image'            => 'required',
    ];
  }

  public function messages(): array
  {
    $locale = LaravelLocalization::getCurrentLocale();

    if ($locale == "ar") {
      return [
        'name.ar.required'          => 'اسم المشروع بالعربي مطلوب',
        'name.ar.max'               => 'اسم المشروع بالعربي يجب ألا يتجاوز 255 حرفًا',
        'name.en.required'          => 'اسم المشروع بالإنجليزي مطلوب',
        'name.en.max'               => 'اسم المشروع بالإنجليزي يجب ألا يتجاوز 255 حرفًا',
        'description.ar.required'   => 'وصف المشروع بالعربي مطلوب',
        'description.en.required'   => 'وصف المشروع بالإنجليزي مطلوب',
        'images.required'           => 'يجب إضافة صورة واحدة على الأقل',
        'images.min'                => 'يجب إضافة صورة واحدة على الأقل',
        'images.array'              => 'يجب أن تكون الصور مصفوفة',
        'images.*.image.required'   => 'الصورة مطلوبة',
      ];
    } else {
      return [
        'name.ar.required'          => 'Project name in Arabic is required',
        'name.ar.max'               => 'Project name in Arabic must not exceed 255 characters',
        'name.en.required'          => 'Project name in English is required',
        'name.en.max'               => 'Project name in English must not exceed 255 characters',
        'description.ar.required'   => 'Project description in Arabic is required',
        'description.en.required'   => 'Project description in English is required',
        'images.required'           => 'At least one image is required',
        'images.min'                => 'At least one image is required',
        'images.array'              => 'Images must be an array',
        'images.*.image.required'   => 'Image is required',
      ];
    }
  }
}
