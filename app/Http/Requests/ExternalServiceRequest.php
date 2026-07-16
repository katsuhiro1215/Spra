<?php

namespace App\Http\Requests;

use App\Models\ExternalService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExternalServiceRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'url' => ['required', 'url', 'max:2048'],
            'description' => ['nullable', 'string', 'max:2000'],
            'icon' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
            'api_base_url' => ['nullable', 'url', 'max:2048'],
            'api_endpoint' => ['nullable', 'string', 'max:255'],
            'auth_type' => ['nullable', Rule::in([
                ExternalService::AUTH_NONE,
                ExternalService::AUTH_BEARER,
                ExternalService::AUTH_API_KEY,
                ExternalService::AUTH_BASIC,
            ])],
            'auth_header' => ['nullable', 'string', 'max:255'],
            'credential' => ['nullable', 'string', 'max:2000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'サービス名は必須です。',
            'name.max' => 'サービス名は255文字以下である必要があります。',
            'url.required' => 'リンクURLは必須です。',
            'url.url' => 'リンクURLの形式が正しくありません。',
            'api_base_url.url' => 'APIベースURLの形式が正しくありません。',
            'auth_type.in' => '認証方式の値が不正です。',
        ];
    }
}
