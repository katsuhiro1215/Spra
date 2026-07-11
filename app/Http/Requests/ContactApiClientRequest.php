<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactApiClientRequest extends FormRequest
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
    return [
      'name' => ['required', 'string', 'max:255'],
    ];
  }

  /**
   * Get custom messages for validator errors.
   */
  public function messages(): array
  {
    return [
      'name.required' => '連携先名は必須です。',
      'name.max' => '連携先名は255文字以下である必要があります。',
    ];
  }
}
