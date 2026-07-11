<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PageTypeRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   */
  public function rules(): array
  {
    $pageTypeId = $this->route('pageType') ? $this->route('pageType')->id : null;

    return [
      'key' => [
        'required',
        'string',
        'max:50',
        Rule::unique('page_types', 'key')->ignore($pageTypeId),
      ],
      'name' => 'required|string|max:255',
      'slug' => [
        'required',
        'string',
        'max:255',
        'regex:/^[a-z0-9\-]+$/',
        Rule::unique('page_types', 'slug')->ignore($pageTypeId),
      ],
      'description' => 'nullable|string|max:500',
      'is_system' => 'boolean',
      'is_dynamic' => 'boolean',
      'has_detail' => 'boolean',
      'allowed_component_types' => 'nullable|array',
      'default_layout' => 'nullable|array',
    ];
  }

  /**
   * Get custom attributes for validator errors.
   */
  public function attributes(): array
  {
    return [
      'key' => 'キー',
      'name' => 'ページタイプ名',
      'slug' => 'スラッグ',
      'description' => '説明',
      'is_system' => 'システムページ',
      'is_dynamic' => '動的ページ',
      'has_detail' => '詳細ページ',
      'allowed_component_types' => '許可コンポーネントタイプ',
      'default_layout' => 'デフォルトレイアウト',
    ];
  }

  /**
   * Get custom messages for validator errors.
   */
  public function messages(): array
  {
    return [
      'key.required' => 'キーは必須です。',
      'key.unique' => 'このキーは既に使用されています。',
      'name.required' => 'ページタイプ名は必須です。',
      'slug.required' => 'スラッグは必須です。',
      'slug.unique' => 'このスラッグは既に使用されています。',
      'slug.regex' => 'スラッグは英小文字、数字、ハイフンのみ使用可能です。',
    ];
  }
}
