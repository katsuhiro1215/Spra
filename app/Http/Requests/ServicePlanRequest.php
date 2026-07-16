<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServicePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $slugRule = ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'];

        // PATCH リクエストの場合は、同じ ID の slug を除外
        if ($this->isMethod('patch') && $this->route('servicePlan')) {
            $slugRule[] = Rule::unique('service_plans', 'slug')->ignore($this->route('servicePlan')->id);
        } else {
            $slugRule[] = 'unique:service_plans,slug';
        }

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => $slugRule,
            'service_id' => ['required', 'exists:services,id'],
            'description' => ['nullable', 'string', 'max:1000'],
            'details' => ['nullable', 'string'],
            'base_price' => ['required', 'numeric', 'min:0'],
            'discount_amount' => ['nullable', 'numeric', 'min:0'],
            'billing_cycle' => ['required', 'in:one_time,monthly,quarterly,yearly'],
            'setup_fee' => ['nullable', 'numeric', 'min:0'],
            'max_revisions' => ['nullable', 'integer', 'min:0'],
            'max_carryover_tickets' => ['nullable', 'integer', 'min:0'],
            'estimated_delivery_days' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'in:active,inactive,suspended'],
            'is_displayed' => ['boolean'],
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
