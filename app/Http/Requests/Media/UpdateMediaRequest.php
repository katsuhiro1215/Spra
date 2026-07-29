<?php

namespace App\Http\Requests\Media;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateMediaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::guard('admins')->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // 単一ファイルまたは複数ファイルに対応
            'file' => ['nullable', 'file', 'mimes:jpeg,jpg,png,gif,webp', 'max:51200'], // 単一ファイル（Modal用）
            'files' => ['nullable', 'array'],
            'files.*' => ['required', 'file', 'mimes:jpeg,jpg,png,gif,webp', 'max:51200'], // 50MB
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'alt_text' => ['nullable', 'string', 'max:255'],
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
            'files' => 'ファイル',
            'files.*' => 'ファイル',
            'title' => 'タイトル',
            'description' => '説明',
            'alt_text' => '代替テキスト',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'files.required' => 'ファイルを選択してください。',
            'files.*.max' => 'ファイルサイズは50MB以下にしてください。',
        ];
    }
}
