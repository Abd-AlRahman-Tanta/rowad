<?php

namespace Modules\Blogs\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;

class BlogRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    $isEdit = $this->isMethod('PUT');

    return [
      'image'         => 'required',
      'heroImage'     => 'required',
      'title.ar'      => 'required|string',
      'title.en'      => 'required|string',
      'summary.ar'    => 'required|string',
      'summary.en'    => 'required|string',
      'content.ar'    => 'required|string',
      'content.en'    => 'required|string',
      'category'      => 'nullable|string',
      'readTime'      => 'nullable|string',
      'published.val' => 'nullable|string',
    ];
  }

  public function messages(): array
  {
    $locale = LaravelLocalization::getCurrentLocale();

    if ($locale === 'ar') {
      return [
        'image.required'        => 'الصورة الرئيسية مطلوبة',
        'heroImage.required'    => 'صورة البطل مطلوبة',
        'title.ar.required'     => 'عنوان المقال بالعربي مطلوب',
        'title.en.required'     => 'عنوان المقال بالإنجليزي مطلوب',
        'summary.ar.required'   => 'ملخص المقال بالعربي مطلوب',
        'summary.en.required'   => 'ملخص المقال بالإنجليزي مطلوب',
        'content.ar.required'   => 'محتوى المقال بالعربي مطلوب',
        'content.en.required'   => 'محتوى المقال بالإنجليزي مطلوب',
      ];
    }

    return [
      'image.required'        => 'Main image is required',
      'heroImage.required'    => 'Hero image is required',
      'title.ar.required'     => 'Arabic title is required',
      'title.en.required'     => 'English title is required',
      'summary.ar.required'   => 'Arabic summary is required',
      'summary.en.required'   => 'English summary is required',
      'content.ar.required'   => 'Arabic content is required',
      'content.en.required'   => 'English content is required',
    ];
  }
}
