<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PointCatalogItemRequest extends FormRequest
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
      'name' => 'required|string|max:255',
      'points_cost' => 'required|integer|min:1',
      'description' => 'nullable|string|max:1000',
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
      'name' => '商品名',
      'points_cost' => '必要ポイント数',
      'description' => '説明',
      'sort_order' => '表示順',
      'is_active' => '有効',
    ];
  }
}
