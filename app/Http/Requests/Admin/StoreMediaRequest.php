<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreMediaRequest extends FormRequest
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
            'files' => 'required|array',
            'files.*' => 'required|file|max:20480', // 20MB max
            'folder' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:100',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'files.required' => 'ファイルを選択してください。',
            'files.*.required' => 'ファイルが選択されていません。',
            'files.*.file' => '有効なファイルを選択してください。',
            'files.*.max' => 'ファイルサイズは20MB以下にしてください。',
            'folder.max' => 'フォルダ名は255文字以下にしてください。',
            'description.max' => '説明は1000文字以下にしてください。',
            'tags.*.max' => 'タグは100文字以下にしてください。',
        ];
    }
}
