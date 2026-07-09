<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QuoteRequest extends FormRequest
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
            'user_id' => 'nullable|uuid|exists:users,id',
            'contact_id' => 'nullable|ulid|exists:contacts,id',
            'company_id' => 'nullable|ulid|exists:companies,id',
            'title' => 'required|string|max:255',
            'requirements' => 'nullable|string',
            'status' => 'nullable|in:draft,sent,viewed,negotiating,approved,rejected,contracted,cancelled',
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'user_id' => 'ユーザー',
            'contact_id' => 'お問い合わせ',
            'company_id' => '会社',
            'title' => '件名',
            'requirements' => '要件',
            'status' => 'ステータス',
        ];
    }
}
