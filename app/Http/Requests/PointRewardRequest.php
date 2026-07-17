<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PointRewardRequest extends FormRequest
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
    $pointRewardId = $this->route('point_reward') ? $this->route('point_reward')->id : null;

    return [
      'code' => [
        'required',
        'string',
        'max:50',
        'regex:/^[a-z0-9_]+$/',
        Rule::unique('point_rewards', 'code')->ignore($pointRewardId),
      ],
      'name' => 'required|string|max:255',
      'points' => 'required|integer',
      'is_active' => 'boolean',
      'description' => 'nullable|string|max:1000',
    ];
  }

  /**
   * Get custom attributes for validator errors.
   */
  public function attributes(): array
  {
    return [
      'code' => 'コード',
      'name' => '特典名',
      'points' => '付与ポイント数',
      'is_active' => '有効',
      'description' => '説明',
    ];
  }

  /**
   * Get custom messages for validator errors.
   */
  public function messages(): array
  {
    return [
      'code.required' => 'コードは必須です。',
      'code.unique' => 'このコードは既に使用されています。',
      'code.regex' => 'コードは半角英小文字、数字、アンダースコアのみ使用可能です。',
    ];
  }
}
