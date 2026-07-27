<?php

namespace App\Http\Requests;

use App\Models\AtlasMembership;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AtlasMembershipRequest extends FormRequest
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
        $rules = [
            'brand' => ['required', Rule::in(AtlasMembership::BRANDS)],
            'status' => ['required', Rule::in(AtlasMembership::STATUSES)],
            'note' => ['nullable', 'string', 'max:2000'],
        ];

        // 新規作成時のみ、対象ユーザーをメールアドレスで指定する
        if ($this->isMethod('post')) {
            $rules['email'] = [
                'required',
                'string',
                'email',
                'exists:users,email',
                function ($attribute, $value, $fail) {
                    $exists = AtlasMembership::whereHas(
                        'user',
                        fn($query) => $query->where('email', $value)
                    )->exists();

                    if ($exists) {
                        $fail('このユーザーは既にAtlas会員として登録されています。');
                    }
                },
            ];
        }

        return $rules;
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'email' => 'メールアドレス',
            'brand' => 'ブランド',
            'status' => 'ステータス',
            'note' => 'メモ',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'email.exists' => 'このメールアドレスのユーザーは見つかりません。',
        ];
    }
}
