<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    // 公開フォームなので誰でもアクセス可能
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    return [
      'name' => ['required', 'string', 'max:255'],
      'email' => ['required', 'email', 'max:255'],
      'phone' => ['nullable', 'string', 'max:20'],
      'company' => ['nullable', 'string', 'max:255'],
      'subject' => ['required', 'string', 'max:255'],
      'message' => ['required', 'string', 'max:5000'],
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
      'name' => 'お名前',
      'email' => 'メールアドレス',
      'phone' => '電話番号',
      'company' => '会社名',
      'subject' => '件名',
      'message' => 'お問い合わせ内容',
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
      'name.required' => ':attributeを入力してください。',
      'name.max' => ':attributeは:max文字以内で入力してください。',
      'email.required' => ':attributeを入力してください。',
      'email.email' => '有効な:attributeを入力してください。',
      'email.max' => ':attributeは:max文字以内で入力してください。',
      'phone.max' => ':attributeは:max文字以内で入力してください。',
      'company.max' => ':attributeは:max文字以内で入力してください。',
      'subject.required' => ':attributeを入力してください。',
      'subject.max' => ':attributeは:max文字以内で入力してください。',
      'message.required' => ':attributeを入力してください。',
      'message.max' => ':attributeは:max文字以内で入力してください。',
    ];
  }
}
