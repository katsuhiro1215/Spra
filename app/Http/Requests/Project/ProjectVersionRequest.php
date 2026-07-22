<?php

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class ProjectVersionRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'start_date' => 'nullable|date|date_format:Y-m-d',
            'estimated_end_date' => 'nullable|date|date_format:Y-m-d|after_or_equal:start_date',
            'total_estimated_hours' => 'nullable|integer|min:0',
            'status' => 'required|in:draft,approved,active,superseded,cancelled',
            'revision_reason' => 'nullable|string|max:1000',
            'copy_from_current' => 'nullable|boolean',
            'import_from_contract' => 'nullable|boolean',
            'auto_generate_milestones' => 'nullable|boolean',
            'milestone_count' => 'nullable|integer|min:1|max:10',
        ];
    }
}
