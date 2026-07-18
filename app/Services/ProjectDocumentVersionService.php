<?php

namespace App\Services;

use App\Models\ProjectDocumentSection;
use App\Models\ProjectDocumentVersion;
use Illuminate\Support\Facades\DB;

class ProjectDocumentVersionService
{
    /**
     * 現在のドラフト版を確定(released)にし、
     * 編集を続けられるように内容を複製した次のドラフト版(v+1)を発行する。
     *
     * ContractService::update() のsent以降の分岐（バージョン複製）と同じ考え方。
     */
    public function release(ProjectDocumentVersion $draft, ?string $nextRevisionReason = null): ProjectDocumentVersion
    {
        return DB::transaction(function () use ($draft, $nextRevisionReason) {
            $draft->update([
                'status'      => 'released',
                'is_current'  => false,
                'released_by' => auth('admins')->id(),
                'released_at' => now(),
            ]);

            $newVersion = ProjectDocumentVersion::create([
                'project_document_id' => $draft->project_document_id,
                'version'             => $draft->version + 1,
                'status'              => 'draft',
                'is_current'          => true,
                'revision_reason'     => $nextRevisionReason,
                'created_by'          => auth('admins')->id(),
            ]);

            $this->cloneSections($draft, $newVersion);

            return $newVersion->load('sections.columns', 'sections.endpoints', 'sections.features', 'sections.screens', 'sections.permissions');
        });
    }

    private function cloneSections(ProjectDocumentVersion $from, ProjectDocumentVersion $to): void
    {
        $from->load([
            'sections.columns',
            'sections.endpoints',
            'sections.features',
            'sections.screens',
            'sections.permissions',
        ]);

        foreach ($from->sections as $section) {
            /** @var ProjectDocumentSection $newSection */
            $newSection = $to->sections()->create($section->only(['section_type', 'title', 'body', 'sort_order']));

            $relation = $section->detailRelationName();
            if (!$relation) {
                continue;
            }

            foreach ($section->{$relation} as $detail) {
                $newSection->{$relation}()->create(
                    $detail->except(['id', 'project_document_section_id', 'created_at', 'updated_at'])
                );
            }
        }
    }
}
