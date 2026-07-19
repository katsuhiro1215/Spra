<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePublicAppointmentRequest extends FormRequest
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
      'appointment_slot_id' => ['required', 'exists:appointment_slots,id'],
      'guest_name' => ['required', 'string', 'max:255'],
      'guest_email' => ['required', 'email', 'max:255'],
      'guest_phone' => ['required', 'string', 'max:30'],
      'description' => ['nullable', 'string', 'max:2000'],
      // ハニーポット（人間には見えない欄。埋まっていればスパムとみなす）
      'website' => ['nullable', 'string'],
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
      'appointment_slot_id' => 'ご希望日時',
      'guest_name' => 'お名前',
      'guest_email' => 'メールアドレス',
      'guest_phone' => '電話番号',
      'description' => 'ご相談内容',
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
      'appointment_slot_id.required' => ':attributeを選択してください。',
      'appointment_slot_id.exists' => '選択された:attributeは無効です。',
      'guest_name.required' => ':attributeを入力してください。',
      'guest_name.max' => ':attributeは:max文字以内で入力してください。',
      'guest_email.required' => ':attributeを入力してください。',
      'guest_email.email' => '有効な:attributeを入力してください。',
      'guest_email.max' => ':attributeは:max文字以内で入力してください。',
      'guest_phone.required' => ':attributeを入力してください。',
      'guest_phone.max' => ':attributeは:max文字以内で入力してください。',
      'description.max' => ':attributeは:max文字以内で入力してください。',
    ];
  }
}
