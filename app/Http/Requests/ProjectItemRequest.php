<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectItemRequest extends FormRequest
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
     *
     * store は items 配列（複数一括登録）、update は単一アイテムのフラットな項目を受け取るため、
     * リクエストの形に応じてルールを切り替える。
     */
    public function rules(): array
    {
        if ($this->has('items')) {
            return [
                'items' => ['required', 'array', 'min:1'],
                'items.*.title' => ['required', 'string', 'max:255'],
                'items.*.description' => ['nullable', 'string'],
                'items.*.service_item_id' => ['nullable', 'exists:service_items,id'],
                'items.*.milestone_id' => ['nullable', 'exists:project_milestones,id'],
                'items.*.start_date' => ['required', 'date'],
                'items.*.end_date' => ['required', 'date', 'after_or_equal:items.*.start_date'],
                'items.*.estimated_hours' => ['nullable', 'numeric', 'min:0'],
                'items.*.status' => ['required', 'in:not_started,in_progress,completed,on_hold,cancelled'],
                'items.*.priority' => ['nullable', 'in:low,medium,high,urgent'],
                'items.*.assigned_to' => ['nullable', 'exists:admins,id'],
            ];
        }

        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'service_item_id' => ['nullable', 'exists:service_items,id'],
            'milestone_id' => ['nullable', 'exists:project_milestones,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'estimated_hours' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'in:not_started,in_progress,completed,on_hold,cancelled'],
            'progress' => ['nullable', 'integer', 'min:0', 'max:100'],
            'priority' => ['nullable', 'in:low,medium,high,urgent'],
            'assigned_to' => ['nullable', 'exists:admins,id'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'items' => 'アイテム',
            'items.*.title' => 'タイトル',
            'items.*.description' => '説明',
            'items.*.service_item_id' => 'サービスアイテム',
            'items.*.milestone_id' => 'マイルストーン',
            'items.*.start_date' => '開始日',
            'items.*.end_date' => '終了日',
            'items.*.estimated_hours' => '見積もり時間',
            'items.*.status' => 'ステータス',
            'items.*.priority' => '優先度',
            'items.*.assigned_to' => '割り当て先',
            'title' => 'タイトル',
            'description' => '説明',
            'service_item_id' => 'サービスアイテム',
            'milestone_id' => 'マイルストーン',
            'start_date' => '開始日',
            'end_date' => '終了日',
            'estimated_hours' => '見積もり時間',
            'status' => 'ステータス',
            'progress' => '進捗率',
            'priority' => '優先度',
            'assigned_to' => '割り当て先',
        ];
    }
}
