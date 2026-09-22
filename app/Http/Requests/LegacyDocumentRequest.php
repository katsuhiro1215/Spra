<?php

namespace App\Http\Requests;

use App\Models\LegacyDocument;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class LegacyDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::guard('admins')->check();
    }

    public function rules(): array
    {
        return [
            'document_type' => ['required', Rule::in(LegacyDocument::DOCUMENT_TYPES)],
            'client_name' => ['required', 'string', 'max:255'],
            'issued_at' => ['required', 'date'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'file' => ['nullable', 'file', 'max:20480', 'mimes:pdf,png,jpg,jpeg'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'document_type.required' => '書類種別を選択してください。',
            'client_name.required' => 'クライアント名を入力してください。',
            'issued_at.required' => '発行日を入力してください。',
            'total_amount.required' => '合計金額を入力してください。',
        ];
    }
}
