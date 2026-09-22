<?php

namespace App\Http\Requests;

use App\Models\Proposal;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProposalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hearing_id' => ['nullable', 'exists:hearings,id'],
            'contact_id' => ['nullable', 'exists:contacts,id'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'status' => ['nullable', Rule::in(Proposal::STATUSES)],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'タイトルを入力してください。',
        ];
    }
}
