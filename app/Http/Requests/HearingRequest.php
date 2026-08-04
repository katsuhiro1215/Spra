<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HearingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth('admins')->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'quote_id' => 'nullable|exists:quotes,id',
            'answers' => 'array',
            'answers.*.hearing_template_item_id' => 'required|exists:hearing_template_items,id',
            'answers.*.answer_text' => 'nullable|string',
            'answers.*.answer_options' => 'nullable|array',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'title' => 'タイトル',
            'notes' => '補足メモ',
        ];
    }
}
