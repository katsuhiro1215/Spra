<?php

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class ProjectRequest extends FormRequest
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
            'inquiry_id' => ['nullable', 'ulid', 'exists:project_inquiries,id'],
            'contract_id' => ['nullable', 'ulid', 'exists:contracts,id'],
            'user_id' => ['required', 'uuid', 'exists:users,id'],
            'company_id' => ['nullable', 'ulid', 'exists:companies,id'],
            'admin_id' => ['nullable', 'uuid', 'exists:admins,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:planning,design,development,testing,review,completed,on_hold,cancelled'],
            'priority' => ['required', 'in:low,medium,high,urgent'],
            'start_date' => ['nullable', 'date'],
            'estimated_end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'actual_end_date' => ['nullable', 'date'],
            'is_client_visible' => ['boolean'],
            'client_visible_notes' => ['nullable', 'string'],
            'internal_notes' => ['nullable', 'string'],
            'sort_order' => ['integer', 'min:0'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['ulid', 'exists:project_categories,id'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'inquiry_id' => '問い合わせ',
            'contract_id' => '契約',
            'user_id' => 'クライアント',
            'company_id' => '企業',
            'admin_id' => '担当管理者',
            'title' => 'プロジェクト名',
            'description' => '説明',
            'thumbnail' => 'サムネイル',
            'status' => 'ステータス',
            'priority' => '優先度',
            'start_date' => '開始日',
            'estimated_end_date' => '予定終了日',
            'actual_end_date' => '実際の終了日',
            'is_client_visible' => 'クライアント閲覧可否',
            'client_visible_notes' => 'クライアント向けメモ',
            'internal_notes' => '内部メモ',
            'sort_order' => '表示順',
            'category_ids' => 'カテゴリ',
        ];
    }
}
