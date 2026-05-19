<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResponseRequest extends FormRequest
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
   *
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    return [
      'response_template_id' => 'nullable|exists:response_templates,id',
      'subject' => 'required|string|max:255',
      'body' => 'required|string',
      'send_now' => 'boolean',
    ];
  }

  /**
   * Get custom attributes for validator errors.
   *
   * @return array<string, string>
   */
  public function attributes(): array
  {
    return [
      'response_template_id' => '返信テンプレート',
      'subject' => '件名',
      'body' => '本文',
      'send_now' => '即時送信',
    ];
  }

  /**
   * Get custom messages for validator errors.
   *
   * @return array<string, string>
   */
  public function messages(): array
  {
    return [
      'subject.required' => '件名は必須です。',
      'subject.max' => '件名は255文字以内で入力してください。',
      'body.required' => '本文は必須です。',
      'response_template_id.exists' => '選択された返信テンプレートは存在しません。',
    ];
  }
}
