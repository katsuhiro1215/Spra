<?php

namespace App\Http\Requests;

use App\Models\ProjectAdmin;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectFromTemplateRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return auth('admins')->check();
  }

  /**
   * Get the validation rules that apply to the request.
   */
  public function rules(): array
  {
    return [
      'title' => ['required', 'string', 'max:255'],
      'description' => ['nullable', 'string'],
      'contract_id' => ['nullable', 'string', 'exists:contracts,id'],
      'admins' => ['required', 'array', 'min:1'],
      'admins.*.admin_id' => ['required', 'string', 'exists:admins,id'],
      'admins.*.role' => ['required', Rule::in(array_keys(ProjectAdmin::ROLES))],
      'start_date' => ['required', 'date'],
      'estimated_end_date' => ['required', 'date', 'after:start_date'],
      'template_id' => ['required', 'string', 'exists:project_templates,id'],
      'milestone_ids' => ['required', 'array', 'min:1'],
      'milestone_ids.*' => ['string', 'exists:project_template_milestones,id'],
    ];
  }

  /**
   * Get custom messages for validator errors.
   */
  public function messages(): array
  {
    return [
      'title.required' => 'プロジェクト名は必須です。',
      'title.max' => 'プロジェクト名は255文字以下である必要があります。',
      'admins.required' => '担当者は1人以上必須です。',
      'admins.min' => '担当者は1人以上必須です。',
      'start_date.required' => '開始予定日は必須です。',
      'estimated_end_date.required' => '納期は必須です。',
      'estimated_end_date.after' => '納期は開始予定日より後の日付である必要があります。',
      'template_id.required' => 'テンプレートは必須です。',
      'milestone_ids.required' => 'マイルストーンを1つ以上選択してください。',
      'milestone_ids.min' => 'マイルストーンを1つ以上選択してください。',
    ];
  }
}
