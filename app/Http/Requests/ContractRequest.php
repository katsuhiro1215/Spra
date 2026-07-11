<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContractRequest extends FormRequest
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
            'quote_id' => 'nullable|ulid|exists:quotes,id',
            'user_id' => 'required|uuid|exists:users,id',
            'company_id' => 'nullable|ulid|exists:companies,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:one_time,monthly,annual',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'billing_day' => 'nullable|integer|min:1|max:31',
            'payment_due_days' => 'nullable|integer|min:1',
            'auto_invoice_generation' => 'boolean',
            'auto_renewal' => 'boolean',
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'quote_id' => '見積書',
            'user_id' => 'ユーザー',
            'company_id' => '会社',
            'title' => '契約件名',
            'description' => '契約概要',
            'type' => '契約タイプ',
            'start_date' => '開始日',
            'end_date' => '終了日',
            'billing_day' => '請求日',
            'payment_due_days' => '支払期限日数',
            'auto_renewal' => '自動更新',
        ];
    }
}
