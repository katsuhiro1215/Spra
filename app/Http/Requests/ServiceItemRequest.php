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
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', 'unique:service_items,slug'],
            'description' => ['nullable', 'string', 'max:1000'],
            'item_type' => ['required', 'in:plan_base,included,optional,addon'],
            'standard_price' => ['required', 'numeric', 'min:0'],
            'internal_cost' => ['required', 'numeric', 'min:0'],
            'estimated_days' => ['nullable', 'integer', 'min:0'],
            'estimated_hours' => ['nullable', 'numeric', 'min:0'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }

    public function messages(): array
    {
        return [
            'service_id.required' => 'サービスを選択してください。',
            'service_id.exists' => '選択されたサービスは存在しません。',
            'name.required' => '項目名は必須です。',
            'item_type.required' => '項目タイプを選択してください。',
            'standard_price.required' => '標準価格は必須です。',
            'standard_price.numeric' => '標準価格は数値で入力してください。',
            'internal_cost.required' => '内部コストは必須です。',
            'internal_cost.numeric' => '内部コストは数値で入力してください。',
            'status.required' => 'ステータスを選択してください。',
        ];
    }
}
