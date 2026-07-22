<?php

namespace App\Http\Requests\Project;

use App\Models\Contract;
use App\Models\ProjectAdmin;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
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
      'description' => ['nullable', 'string', 'max:2000'],
      'status' => ['required', 'in:planning,design,development,testing,review,completed,on_hold,cancelled'],
      'priority' => ['nullable', 'in:low,medium,high,urgent'],
      'contract_id' => ['nullable', 'string', 'exists:contracts,id'],
      'user_id' => ['required', 'string', 'exists:users,id'],
      'company_id' => ['nullable', 'string', 'exists:companies,id'],
      'repository_url' => ['nullable', 'url', 'max:255'],
      'production_url' => ['nullable', 'url', 'max:255'],
      'admins' => ['required', 'array', 'min:1'],
      'admins.*.admin_id' => ['required', 'string', 'exists:admins,id'],
      'admins.*.role' => ['required', Rule::in(array_keys(ProjectAdmin::ROLES))],
      'start_date' => ['required', 'date', 'date_format:Y-m-d'],
      'estimated_end_date' => ['nullable', 'date', 'date_format:Y-m-d', 'after_or_equal:start_date'],
      'actual_end_date' => ['nullable', 'date', 'date_format:Y-m-d'],
      'is_client_visible' => ['nullable', 'boolean'],
      'client_visible_notes' => ['nullable', 'string', 'max:1000'],
      'internal_notes' => ['nullable', 'string', 'max:1000'],
      'technology_ids' => ['nullable', 'array'],
      'technology_ids.*' => ['string', 'exists:technologies,id'],
    ];
  }

  /**
   * technology_idsは、契約先のServicePlan→Serviceが持つ使用技術の範囲に限定する。
   */
  public function withValidator($validator): void
  {
    $validator->after(function ($validator) {
      $technologyIds = $this->input('technology_ids', []);

      if (!empty($technologyIds)) {
        $contract = $this->input('contract_id')
          ? Contract::with('servicePlan.service.technologies')->find($this->input('contract_id'))
          : null;
        $service = $contract?->servicePlan?->service;
        $availableIds = $service ? $service->technologies->pluck('id')->all() : [];

        if (array_diff($technologyIds, $availableIds) !== []) {
          $validator->errors()->add(
            'technology_ids',
            '選択された使用技術の中に、契約先のサービスで許可されていないものが含まれています。',
          );
        }
      }

      $admins = collect($this->input('admins', []));
      $adminIds = $admins->pluck('admin_id')->filter();

      if ($adminIds->count() !== $adminIds->unique()->count()) {
        $validator->errors()->add('admins', '同じ担当者を複数回指定することはできません。');
      }

      if ($admins->where('role', 'leader')->count() !== 1) {
        $validator->errors()->add('admins', 'リーダーは1人だけ指定してください。');
      }
    });
  }

  /**
   * Get custom attributes for validator errors.
   */
  public function attributes(): array
  {
    return [
      'title' => 'プロジェクト名',
      'description' => '説明',
      'status' => 'ステータス',
      'priority' => '優先度',
      'contract_id' => '契約',
      'user_id' => 'クライアント',
      'company_id' => '企業',
      'repository_url' => 'リポジトリURL',
      'production_url' => '公開URL',
      'admins' => '担当管理者',
      'admins.*.admin_id' => '担当管理者',
      'admins.*.role' => '役割',
      'start_date' => '開始日',
      'estimated_end_date' => '予定終了日',
      'actual_end_date' => '実績終了日',
      'is_client_visible' => 'クライアント公開',
      'client_visible_notes' => 'クライアントへのメモ',
      'internal_notes' => '内部メモ',
      'technology_ids' => '使用技術',
    ];
  }

  /**
   * Get custom messages for validator errors.
   */
  public function messages(): array
  {
    return [
      'title.required' => 'プロジェクト名は必須です。',
      'user_id.required' => 'クライアントは必須です。',
      'admins.required' => '担当管理者は1人以上必須です。',
      'admins.min' => '担当管理者は1人以上必須です。',
      'admins.*.admin_id.required' => '担当管理者を選択してください。',
      'admins.*.role.required' => '役割を選択してください。',
      'start_date.required' => '開始日は必須です。',
      'start_date.date_format' => '開始日は Y-m-d 形式である必要があります。',
      'estimated_end_date.after_or_equal' => '予定終了日は開始日以降である必要があります。',
    ];
  }
}
