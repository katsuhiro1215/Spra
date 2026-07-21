<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContractTemplateRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'template_type' => ['required', 'in:standard,monthly,annual,custom'],
            'terms_and_conditions' => ['nullable', 'string'],
            'special_provisions' => ['nullable', 'string'],
            'status' => ['required', 'in:active,inactive'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'テンプレート名',
            'description' => '説明',
            'template_type' => 'テンプレート種別',
            'terms_and_conditions' => '契約条項',
            'special_provisions' => '特別条項',
            'status' => 'ステータス',
            'sort_order' => '表示順',
        ];
    }
}
