<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectMilestoneRequest extends FormRequest
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
      'title' => ['required', 'string', 'max:255'],
      'description' => ['nullable', 'string'],
      'status' => ['required', 'in:pending,in_progress,completed,skipped'],
      'due_date' => ['nullable', 'date'],
      'completed_at' => ['nullable', 'date'],
      'sort_order' => ['integer', 'min:0'],
      'is_client_visible' => ['boolean'],
    ];
  }

  /**
   * Get custom attributes for validator errors.
   */
  public function attributes(): array
  {
    return [
      'title' => 'タイトル',
      'description' => '説明',
      'status' => 'ステータス',
      'due_date' => '期限',
      'completed_at' => '完了日時',
      'sort_order' => '表示順',
      'is_client_visible' => 'クライアント閲覧可否',
    ];
  }
}
