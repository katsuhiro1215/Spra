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
      'slug' => 'スラッグ',
      'description' => '概要説明',
      'detailed_description' => '詳細説明',
      'pricing_model' => '料金体系',
      'estimated_delivery_days' => '標準納期',
      'base_price' => '基本価格',
      'price_unit' => '価格単位',
      'sort_order' => '表示順序',
      'consultation_note' => '相談時の注意事項',
      'published_at' => '公開日時',
    ];
  }
}
