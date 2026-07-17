<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CampaignRequest extends FormRequest
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
    $campaignId = $this->route('campaign') ? $this->route('campaign')->id : null;

    return [
      'name' => 'required|string|max:255',
      'code' => [
        'required',
        'string',
        'max:50',
        'regex:/^[A-Za-z0-9\-_]+$/',
        Rule::unique('campaigns', 'code')->ignore($campaignId),
      ],
      'description' => 'nullable|string|max:1000',
      'discount_type' => 'required|in:percentage,fixed',
      'discount_value' => [
        'required',
        'numeric',
        'min:0',
        Rule::when(
          $this->input('discount_type') === 'percentage',
          ['max:100']
        ),
      ],
      'starts_at' => 'required|date',
      'ends_at' => 'required|date|after:starts_at',
      'is_active' => 'boolean',
    ];
  }

  /**
   * Get custom attributes for validator errors.
   */
  public function attributes(): array
  {
    return [
      'name' => 'キャンペーン名',
      'code' => 'キャンペーンコード',
      'description' => '説明',
      'discount_type' => '割引種別',
      'discount_value' => '割引値',
      'starts_at' => '開始日時',
      'ends_at' => '終了日時',
      'is_active' => '有効',
    ];
  }

  /**
   * Get custom messages for validator errors.
   */
  public function messages(): array
  {
    return [
      'code.required' => 'キャンペーンコードは必須です。',
      'code.unique' => 'このキャンペーンコードは既に使用されています。',
      'code.regex' => 'キャンペーンコードは半角英数字、ハイフン、アンダースコアのみ使用可能です。',
      'discount_value.max' => '定率割引は100%以下で設定してください。',
      'ends_at.after' => '終了日時は開始日時より後に設定してください。',
    ];
  }
}
