<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectTemplateMilestoneRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return auth('admins')->check();
  }

  /**
   * Get the validation rules that apply to the request.
   */
  public function rules(): array
  {
    return [
      'milestone_name' => ['required', 'string', 'max:255'],
      'description' => ['nullable', 'string'],
      'order' => ['required', 'integer', 'min:0'],
    ];
  }

  /**
   * Get custom messages for validator errors.
   */
  public function messages(): array
  {
    return [
      'milestone_name.required' => 'マイルストーン名は必須です。',
      'milestone_name.string' => 'マイルストーン名は文字列である必要があります。',
      'milestone_name.max' => 'マイルストーン名は255文字以下である必要があります。',
      'description.string' => '説明は文字列である必要があります。',
      'order.required' => 'マイルストーン順序は必須です。',
      'order.integer' => 'マイルストーン順序は整数である必要があります。',
      'order.min' => 'マイルストーン順序は0以上である必要があります。',
    ];
  }
}
