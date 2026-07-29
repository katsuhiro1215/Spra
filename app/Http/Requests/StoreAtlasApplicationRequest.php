<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAtlasApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // 公開フォームなので誰でもアクセス可能
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
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'message' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'お名前',
            'email' => 'メールアドレス',
            'phone' => '電話番号',
            'message' => 'ご紹介・ご要望',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => ':attributeを入力してください。',
            'name.max' => ':attributeは:max文字以内で入力してください。',
            'email.required' => ':attributeを入力してください。',
            'email.email' => '有効な:attributeを入力してください。',
            'email.max' => ':attributeは:max文字以内で入力してください。',
            'phone.max' => ':attributeは:max文字以内で入力してください。',
            'message.max' => ':attributeは:max文字以内で入力してください。',
        ];
    }
}
