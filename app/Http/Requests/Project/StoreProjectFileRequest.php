<?php

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreProjectFileRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'max:20480', // 20MB
                'mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,zip,png,jpg,jpeg,gif,csv,txt',
            ],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_client_visible' => ['boolean'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'file' => 'ファイル',
            'description' => '説明',
            'is_client_visible' => 'クライアント閲覧可否',
        ];
    }
}
