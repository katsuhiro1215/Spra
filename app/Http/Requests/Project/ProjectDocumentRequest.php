<?php

namespace App\Http\Requests\Project;

use App\Models\ProjectDocument;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'document_type' => ['required', Rule::in(array_keys(ProjectDocument::DOCUMENT_TYPES))],
            'title' => 'nullable|string|max:255',
            'is_client_deliverable' => 'nullable|boolean',
        ];
    }
}
