<?php

namespace App\Http\Requests;

use App\Models\ProjectDocumentSection;
use App\Models\ProjectDocumentSectionEndpoint;
use App\Models\ProjectDocumentSectionFeature;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * db_table / api_group / feature_list / screen_list / permission_list 型セクションの
 * 明細行を丸ごと入れ替える際のバリデーション。section_typeごとにrows内の項目が異なる。
 */
class ProjectDocumentSectionDetailsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        /** @var ProjectDocumentSection $section */
        $section = $this->route('section');

        return match ($section->section_type) {
            'db_table' => [
                'rows' => 'array',
                'rows.*.name' => 'required|string|max:255',
                'rows.*.data_type' => 'required|string|max:100',
                'rows.*.length' => 'nullable|string|max:50',
                'rows.*.nullable' => 'nullable|boolean',
                'rows.*.default_value' => 'nullable|string|max:255',
                'rows.*.is_primary_key' => 'nullable|boolean',
                'rows.*.is_unique' => 'nullable|boolean',
                'rows.*.references_table' => 'nullable|string|max:255',
                'rows.*.references_column' => 'nullable|string|max:255',
                'rows.*.comment' => 'nullable|string|max:255',
            ],
            'api_group' => [
                'rows' => 'array',
                'rows.*.http_method' => ['required', Rule::in(ProjectDocumentSectionEndpoint::HTTP_METHODS)],
                'rows.*.path' => 'required|string|max:255',
                'rows.*.summary' => 'nullable|string|max:255',
                'rows.*.request_body' => 'nullable|string',
                'rows.*.response_body' => 'nullable|string',
                'rows.*.status_codes' => 'nullable|string|max:100',
                'rows.*.notes' => 'nullable|string',
            ],
            'feature_list' => [
                'rows' => 'array',
                'rows.*.name' => 'required|string|max:255',
                'rows.*.description' => 'nullable|string',
                'rows.*.related_screen' => 'nullable|string|max:255',
                'rows.*.priority' => ['nullable', Rule::in(array_keys(ProjectDocumentSectionFeature::PRIORITIES))],
                'rows.*.status' => ['nullable', Rule::in(array_keys(ProjectDocumentSectionFeature::STATUSES))],
            ],
            'screen_list' => [
                'rows' => 'array',
                'rows.*.screen_name' => 'required|string|max:255',
                'rows.*.path' => 'nullable|string|max:255',
                'rows.*.description' => 'nullable|string',
                'rows.*.related_features' => 'nullable|string|max:255',
            ],
            'permission_list' => [
                'rows' => 'array',
                'rows.*.role_name' => 'required|string|max:255',
                'rows.*.permission' => 'required|string|max:255',
                'rows.*.description' => 'nullable|string',
            ],
            default => ['rows' => 'array'],
        };
    }
}
