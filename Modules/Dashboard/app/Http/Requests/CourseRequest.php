<?php

namespace Modules\Dashboard\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;

class CourseRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      // Basic data
      'name.ar'               => 'required|string|max:255',
      'name.en'               => 'required|string|max:255',
      'description.ar'        => 'required|string',
      'description.en'        => 'required|string',
      'price'                 => 'required|string',
      'newCourse.val'             => 'string',

      // Main images - required files for create
      'image'                 => 'required',
      'heroImage'             => 'required',

      // Images array with structure [{image: file}]
      'images'                => 'nullable|array',
      'images.*.image'        => 'nullable',

      // Learning points - required
      'learningPoints'        => 'required|array|min:1',
      'learningPoints.*.title.ar' => 'required|string|max:255',
      'learningPoints.*.title.en' => 'required|string|max:255',

      // Topics - required
      'topics'                => 'required|array|min:1',
      'topics.*.title.ar'     => 'required|string|max:255',
      'topics.*.title.en'     => 'required|string|max:255',
    ];
  }

  public function messages(): array
  {
    $locale = LaravelLocalization::getCurrentLocale();

    if ($locale == "ar") {
      return [
        // Name fields
        'name.ar.required'                      => 'اسم الكورس بالعربي مطلوب',
        'name.en.required'                      => 'اسم الكورس بالإنجليزي مطلوب',

        // Description fields
        'description.ar.required'               => 'وصف الكورس بالعربي مطلوب',
        'description.en.required'               => 'وصف الكورس بالإنجليزي مطلوب',

        // Price
        'price.required'                        => 'السعر مطلوب',

        // Main images
        'image.required'                        => 'الصورة الرئيسية مطلوبة',
        'heroImage.required'                    => 'صورة البطل (Hero) مطلوبة',


        // Learning points
        'learningPoints.required'               => 'نقاط التعلم مطلوبة',
        'learningPoints.min'                    => 'يجب إضافة نقطة تعلم واحدة على الأقل',
        'learningPoints.array'                  => 'يجب أن تكون نقاط التعلم مصفوفة',
        'learningPoints.*.title.ar.required'    => 'عنوان نقطة التعلم بالعربي مطلوب',
        'learningPoints.*.title.en.required'    => 'عنوان نقطة التعلم بالإنجليزي مطلوب',

        // Topics
        'topics.required'                       => 'المواضيع مطلوبة',
        'topics.min'                            => 'يجب إضافة موضوع واحد على الأقل',
        'topics.array'                          => 'يجب أن تكون المواضيع مصفوفة',
        'topics.*.title.ar.required'            => 'عنوان الموضوع بالعربي مطلوب',
        'topics.*.title.en.required'            => 'عنوان الموضوع بالإنجليزي مطلوب',
      ];
    } else {
      return [
        // Name fields
        'name.ar.required'                      => 'Course name in Arabic is required',
        'name.en.required'                      => 'Course name in English is required',

        // Description fields
        'description.ar.required'               => 'Course description in Arabic is required',
        'description.en.required'               => 'Course description in English is required',

        // Price
        'price.required'                        => 'Price is required',

        // Main images
        'image.required'                        => 'Main image is required',
        'heroImage.required'                    => 'Hero image is required',


        // Learning points
        'learningPoints.required'               => 'Learning points are required',
        'learningPoints.min'                    => 'At least one learning point is required',
        'learningPoints.array'                  => 'Learning points must be an array',
        'learningPoints.*.title.ar.required'    => 'Learning point title in Arabic is required',
        'learningPoints.*.title.en.required'    => 'Learning point title in English is required',

        // Topics
        'topics.required'                       => 'Topics are required',
        'topics.min'                            => 'At least one topic is required',
        'topics.array'                          => 'Topics must be an array',
        'topics.*.title.ar.required'            => 'Topic title in Arabic is required',
        'topics.*.title.en.required'            => 'Topic title in English is required',
      ];
    }
  }
}
