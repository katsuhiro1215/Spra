<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactCategoryRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return auth('admin')->check();
  }

  /**
   * Get the validation rules that apply to the request.
   */
  public function rules(): array
  {
    $id = $this->route('contact_category');

    return [
      'name' => [
        'required',
        'string',
        'max:255',
        $id
          ? "unique:contact_categories,name,{$id},id"
          : 'unique:contact_categories,name',
      ],
      'description' => 'nullable|string|max:1000',
      'sort_order' => 'nullable|integer|min:0',
      'is_active' => 'nullable|boolean',
    ];
  }

  /**
   * Get custom messages for validator errors.
   */
  public function messages(): array
  {
    return [
      'name.required' => 'カテゴリ名は必須です。',
      'name.unique' => 'このカテゴリ名は既に存在します。',
      'name.max' => 'カテゴリ名は255文字以下である必要があります。',
      'description.max' => '説明は1000文字以下である必要があります。',
      'sort_order.integer' => 'ソート順は整数である必要があります。',
    ];
  }
}
