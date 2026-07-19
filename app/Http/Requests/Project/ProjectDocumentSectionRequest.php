<?php

namespace App\Http\Requests\Project;

use App\Models\ProjectDocumentSection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectDocumentSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // store時のみ section_type が必須。update時（メタ更新）はtitle/bodyのみ。
        $rules = [
            'title' => 'required|string|max:255',
            'body' => 'nullable|string',
        ];

        if ($this->isMethod('post')) {
            $rules['section_type'] = ['required', Rule::in(array_keys(ProjectDocumentSection::SECTION_TYPES))];
        }

        return $rules;
    }
}
