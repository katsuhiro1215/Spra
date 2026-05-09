<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectInquiryRequest extends FormRequest
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
      'user_id' => ['required', 'uuid', 'exists:users,id'],
      'company_id' => ['nullable', 'ulid', 'exists:companies,id'],
      'title' => ['required', 'string', 'max:255'],
      'summary' => ['nullable', 'string'],
      'budget_min' => ['nullable', 'numeric', 'min:0'],
      'budget_max' => ['nullable', 'numeric', 'min:0', 'gte:budget_min'],
      'desired_delivery_date' => ['nullable', 'date', 'after_or_equal:today'],
      'status' => ['required', 'in:new,in_discussion,estimated,contracted,cancelled'],
      'hearing_notes' => ['nullable', 'string'],
      'admin_notes' => ['nullable', 'string'],
      'assigned_admin_id' => ['nullable', 'uuid', 'exists:admins,id'],
      'quote_id' => ['nullable', 'ulid', 'exists:quotes,id'],
    ];
  }

  /**
   * Get custom attributes for validator errors.
   */
  public function attributes(): array
  {
    return [
      'user_id' => 'クライアント',
      'company_id' => '企業',
      'title' => 'タイトル',
      'summary' => '概要',
      'budget_min' => '最小予算',
      'budget_max' => '最大予算',
      'desired_delivery_date' => '希望納期',
      'status' => 'ステータス',
      'hearing_notes' => 'ヒアリング内容',
      'admin_notes' => '管理者メモ',
      'assigned_admin_id' => '担当管理者',
      'quote_id' => '見積',
    ];
  }
}
