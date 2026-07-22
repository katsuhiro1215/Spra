<?php

namespace App\Services;

use App\Models\ProjectDocumentSection;
use App\Models\ProjectDocumentVersion;
use Illuminate\Support\Facades\DB;

class ProjectDocumentSectionService
{
    public function create(ProjectDocumentVersion $version, string $sectionType, string $title): ProjectDocumentSection
    {
        $maxOrder = $version->sections()->max('sort_order') ?? 0;

        return $version->sections()->create([
            'section_type' => $sectionType,
            'title'        => $title,
            'sort_order'   => $maxOrder + 1,
        ]);
    }

    /**
     * セクションのタイトル・本文(text型)を更新する
     */
    public function updateMeta(ProjectDocumentSection $section, array $data): ProjectDocumentSection
    {
        $section->update(array_intersect_key($data, array_flip(['title', 'body'])));

        return $section;
    }

    /**
     * 明細行(rows)型セクションの中身を丸ごと入れ替える。
     * ContractService::update() の「既存itemsを削除して作り直す」方式と同じ。
     */
    public function replaceDetails(ProjectDocumentSection $section, array $rows): ProjectDocumentSection
    {
        $relation = $section->detailRelationName();

        if (!$relation) {
            return $section;
        }

        DB::transaction(function () use ($section, $relation, $rows) {
            $section->{$relation}()->delete();

            foreach (array_values($rows) as $index => $row) {
                $row['sort_order'] = $index;
                $section->{$relation}()->create($row);
            }
        });

        return $section->load($relation);
    }

    /**
     * ドラッグ&ドロップで確定した並び順を反映する
     */
    public function reorder(ProjectDocumentVersion $version, array $orderedSectionIds): void
    {
        DB::transaction(function () use ($version, $orderedSectionIds) {
            foreach ($orderedSectionIds as $index => $sectionId) {
                $version->sections()->whereKey($sectionId)->update(['sort_order' => $index]);
            }
        });
    }

    public function delete(ProjectDocumentSection $section): bool
    {
        return $section->delete();
    }
}
