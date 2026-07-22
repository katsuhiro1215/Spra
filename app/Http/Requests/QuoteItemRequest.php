<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QuoteItemRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.service_id' => 'required|ulid|exists:services,id',
            'items.*.service_item_id' => 'nullable|ulid|exists:service_items,id',
            'items.*.name' => 'required|string|max:255',
            'items.*.description' => 'nullable|string',
            'items.*.item_type' => 'nullable|string|max:50',
            'items.*.billing_type' => 'required|in:one_time,monthly,quarterly,yearly',
            'items.*.quantity' => 'required|numeric|min:0.01',
            // プラン割引/追加料金の明細行は負の単価を取り得るため下限を設けない
            'items.*.unit_price' => 'required|numeric',
            'items.*.estimated_days' => 'nullable|integer|min:0',
            'items.*.sort_order' => 'nullable|integer',
            'discount_amount' => 'nullable|numeric|min:0',
            'campaign_id' => 'nullable|exists:campaigns,id',
            'service_plan_id' => 'nullable|exists:service_plans,id',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'custom_specifications' => 'nullable|string',
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'items' => '見積明細',
            'items.*.service_id' => 'サービス',
            'items.*.service_item_id' => 'サービス項目',
            'items.*.name' => '項目名',
            'items.*.description' => '説明',
            'items.*.item_type' => '項目タイプ',
            'items.*.billing_type' => '課金タイプ',
            'items.*.quantity' => '数量',
            'items.*.unit_price' => '単価',
            'items.*.estimated_days' => '見積日数',
            'items.*.sort_order' => '表示順',
            'discount_amount' => '値引き額',
            'tax_rate' => '消費税率',
            'custom_specifications' => 'カスタム仕様',
        ];
    }
}
