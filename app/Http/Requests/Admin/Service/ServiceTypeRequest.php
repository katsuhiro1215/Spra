<?php

namespace App\Http\Requests\Admin\Service;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServiceTypeRequest extends FormRequest
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
    $serviceTypeId = $this->route('service_type') ? $this->route('service_type')->id : null;
    $isUpdate = $this->isMethod('put') || $this->isMethod('patch');

    return [
      'service_category_id' => 'required|exists:service_categories,id',
      'name' => 'required|string|max:255',
      'product_name' => 'nullable|string|max:255',
      'version' => 'nullable|string|max:20',
      'parent_service_id' => $isUpdate ? [
        'nullable',
        'exists:service_types,id',
        Rule::notIn([$serviceTypeId]), // 自分自身を親にできない
      ] : 'nullable|exists:service_types,id',
      'slug' => $isUpdate ? [
        'nullable',
        'string',
        'max:255',
        Rule::unique('service_types')->ignore($serviceTypeId),
      ] : 'nullable|string|max:255|unique:service_types,slug',
      'description' => 'nullable|string|max:1000',
      'detailed_description' => 'nullable|string',
      'pricing_model' => 'required|in:fixed,subscription,custom,hybrid',
      'features' => 'nullable|array',
      'features.*' => 'string|max:255',
      'target_audience' => 'nullable|array',
      'target_audience.*' => 'string|max:255',
      'deliverables' => 'nullable|array',
      'deliverables.*' => 'string|max:255',
      'technologies' => 'nullable|array',
      'technologies.*' => 'string|max:255',
      'icon' => 'nullable|string|max:255',
      'color' => 'nullable|string|regex:/^#[a-fA-F0-9]{6}$/',
      'estimated_delivery_days' => 'nullable|integer|min:1',
      'base_price' => 'nullable|numeric|min:0|max:99999999.99',
      'price_unit' => 'nullable|string|max:50',
      'sort_order' => 'nullable|integer|min:0',
      'is_active' => 'boolean',
      'is_featured' => 'boolean',
      'requires_consultation' => 'boolean',
      'consultation_note' => 'nullable|string|max:1000',
      'published_at' => 'nullable|date',
    ];
  }

  /**
   * Get custom messages for validator errors.
   */
  public function messages(): array
  {
    return [
      'service_category_id.required' => 'サービスカテゴリは必須です。',
      'service_category_id.exists' => '選択されたサービスカテゴリは存在しません。',
      'name.required' => 'サービスタイプ名は必須です。',
      'name.max' => 'サービスタイプ名は255文字以内で入力してください。',
      'product_name.max' => '商品愛称は255文字以内で入力してください。',
      'version.max' => 'バージョンは20文字以内で入力してください。',
      'parent_service_id.exists' => '選択された親サービスは存在しません。',
      'parent_service_id.not_in' => 'サービスタイプは自分自身を親にできません。',
      'slug.max' => 'スラッグは255文字以内で入力してください。',
      'slug.unique' => 'このスラッグは既に使用されています。',
      'description.max' => '概要説明は1000文字以内で入力してください。',
      'pricing_model.required' => '料金体系は必須です。',
      'pricing_model.in' => '料金体系の値が不正です。',
      'features.array' => '特徴は配列である必要があります。',
      'features.*.max' => '各特徴は255文字以内で入力してください。',
      'target_audience.array' => '対象ユーザーは配列である必要があります。',
      'target_audience.*.max' => '各対象ユーザーは255文字以内で入力してください。',
      'deliverables.array' => '提供物は配列である必要があります。',
      'deliverables.*.max' => '各提供物は255文字以内で入力してください。',
      'technologies.array' => '使用技術は配列である必要があります。',
      'technologies.*.max' => '各使用技術は255文字以内で入力してください。',
      'icon.max' => 'アイコンは255文字以内で入力してください。',
      'color.regex' => 'カラーコードの形式が不正です。',
      'estimated_delivery_days.integer' => '標準納期は整数である必要があります。',
      'estimated_delivery_days.min' => '標準納期は1以上の値で入力してください。',
      'base_price.numeric' => '基本価格は数値である必要があります。',
      'base_price.min' => '基本価格は0以上の値で入力してください。',
      'base_price.max' => '基本価格は99999999.99以下の値で入力してください。',
      'price_unit.max' => '価格単位は50文字以内で入力してください。',
      'sort_order.integer' => '表示順序は整数である必要があります。',
      'sort_order.min' => '表示順序は0以上の値で入力してください。',
      'consultation_note.max' => '相談時の注意事項は1000文字以内で入力してください。',
      'published_at.date' => '公開日時の形式が不正です。',
    ];
  }

  /**
   * Get custom attributes for validator errors.
   */
  public function attributes(): array
  {
    return [
      'service_category_id' => 'サービスカテゴリ',
      'name' => 'サービスタイプ名',
      'product_name' => '商品愛称',
      'version' => 'バージョン',
      'parent_service_id' => '親サービス',
      'description' => '概要説明',
      'detailed_description' => '詳細説明',
      'pricing_model' => '料金体系',
      'estimated_delivery_days' => '標準納期',
      'base_price' => '基本価格',
      'price_unit' => '価格単位',
      'consultation_note' => '相談時の注意事項',
      'published_at' => '公開日時',
    ];
  }
}
