<?php

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class ProjectUpdateRequest extends FormRequest
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
      'content' => ['required', 'string'],
      'type' => ['required', 'in:progress,issue,milestone,general'],
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
      'content' => '内容',
      'type' => 'タイプ',
      'is_client_visible' => 'クライアント閲覧可否',
    ];
  }
}
