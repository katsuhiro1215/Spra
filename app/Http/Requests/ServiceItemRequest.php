<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServiceItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service_id' => ['required', 'exists:services,id'],
            'service_plan_id' => ['nullable', 'exists:service_plans,id'],
            'item_type' => ['required', 'in:plan_base,included,optional,addon'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price' => ['required', 'numeric', 'min:0'],
            'estimated_days' => ['nullable', 'integer', 'min:0'],
            'is_required' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }

    public function messages(): array
    {
        return [
            'service_id.required' => 'サービスを選択してください。',
            'service_id.exists' => '選択されたサービスは存在しません。',
            'service_plan_id.exists' => '選択されたプランは存在しません。',
            'item_type.required' => '項目タイプを選択してください。',
            'name.required' => '項目名は必須です。',
            'price.required' => '価格は必須です。',
            'price.numeric' => '価格は数値で入力してください。',
            'status.required' => 'ステータスを選択してください。',
        ];
    }
}
