<?php

namespace App\Http\Requests;

use App\Models\AtlasMembership;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AtlasInviteCodeRequest extends FormRequest
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
            'brand' => ['required', Rule::in(AtlasMembership::BRANDS)],
            'expires_at' => ['nullable', 'date', 'after:now'],
            'note' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'brand' => 'ブランド',
            'expires_at' => '有効期限',
            'note' => 'メモ',
        ];
    }
}
