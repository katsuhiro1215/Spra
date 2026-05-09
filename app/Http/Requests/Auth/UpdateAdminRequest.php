<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class UpdateAdminRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * バリデーションルール
     * 新規作成時はパスワード自動生成のため不要
     */
    public function rules(): array
    {
        $adminId = $this->route('admin') ? $this->route('admin')->id : null;

        return [
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('admins')->ignore($adminId),
            ],
            'role' => ['required', 'string', 'max:20'],
            'status' => ['required', 'in:active,inactive,suspended'],
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ];
    }

    /**
     * カスタムエラーメッセージ
     */
    public function messages(): array
    {
        return [
            'email.required' => 'メールアドレスは必須です。',
            'email.email' => '有効なメールアドレスを入力してください。',
            'email.unique' => 'このメールアドレスは既に登録されています。',
            'role.required' => '役割を選択してください。',
            'status.in' => '有効なステータスを選択してください。',
            'password.min' => 'パスワードは8文字以上で入力してください。',
            'password.confirmed' => 'パスワードが確認用と一致しません。',
        ];
    }

    /**
     * カスタム属性名
     */
    public function attributes(): array
    {
        return [
            'email' => 'メールアドレス',
            'role' => '役割',
            'status' => 'ステータス',
            'password' => 'パスワード',
            'password_confirmation' => 'パスワード確認',
        ];
    }
}
