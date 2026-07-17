<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReferralRequest extends FormRequest
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
    return [
      'referrer_company_id' => 'required|exists:companies,id',
      'referred_company_id' => 'nullable|exists:companies,id|different:referrer_company_id',
      'referred_contact_id' => 'nullable|exists:contacts,id',
      'status' => 'nullable|in:pending,expired,cancelled',
      'description' => 'nullable|string|max:1000',
    ];
  }

  /**
   * Get custom attributes for validator errors.
   */
  public function attributes(): array
  {
    return [
      'referrer_company_id' => '紹介者（会社）',
      'referred_company_id' => '被紹介者（会社）',
      'referred_contact_id' => '被紹介者（お問い合わせ）',
      'status' => 'ステータス',
      'description' => '説明',
    ];
  }

  /**
   * Get custom messages for validator errors.
   */
  public function messages(): array
  {
    return [
      'referrer_company_id.required' => '紹介者（会社）は必須です。',
      'referred_company_id.different' => '被紹介者は紹介者と異なる会社を選択してください。',
    ];
  }
}
