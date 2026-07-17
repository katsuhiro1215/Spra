<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MembershipRankRequest extends FormRequest
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
    $membershipRankId = $this->route('membership_rank') ? $this->route('membership_rank')->id : null;

    return [
      'key' => [
        'required',
        'string',
        'max:50',
        'regex:/^[a-z0-9_]+$/',
        Rule::unique('membership_ranks', 'key')->ignore($membershipRankId),
      ],
      'name' => 'required|string|max:255',
      'min_annual_amount' => 'required|numeric|min:0',
      'description' => 'nullable|string|max:2000',
      'sort_order' => 'nullable|integer',
      'is_active' => 'boolean',
    ];
  }

  /**
   * Get custom attributes for validator errors.
   */
  public function attributes(): array
  {
    return [
      'key' => 'キー',
      'name' => 'ランク名',
      'min_annual_amount' => '年間利用額のしきい値',
      'description' => '説明',
      'sort_order' => '表示順',
      'is_active' => '有効',
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
      'key.regex' => 'キーは半角英小文字、数字、アンダースコアのみ使用可能です。',
    ];
  }
}
