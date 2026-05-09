<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServicePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', 'unique:service_plans,slug'],
            'service_id' => ['required', 'exists:services,id'],
            'description' => ['nullable', 'string', 'max:1000'],
            'details' => ['nullable', 'string'],
            'base_price' => ['required', 'numeric', 'min:0'],
            'billing_cycle' => ['required', 'in:one_time,monthly,quarterly,yearly'],
            'setup_fee' => ['nullable', 'numeric', 'min:0'],
            'max_revisions' => ['nullable', 'integer', 'min:0'],
            'estimated_delivery_days' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'in:active,inactive,suspended'],
            'is_featured' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'badge_text' => ['nullable', 'string', 'max:50'],
            'icon' => ['nullable', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'プラン名は必須です。',
            'service_id.required' => 'サービスを選択してください。',
            'service_id.exists' => '選択されたサービスは存在しません。',
            'base_price.required' => '基本料金は必須です。',
            'base_price.numeric' => '基本料金は数値で入力してください。',
            'status.required' => 'ステータスを選択してください。',
        ];
    }
}
