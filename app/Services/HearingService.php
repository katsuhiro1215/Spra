<?php

namespace App\Services;

use App\Models\Hearing;
use App\Models\HearingTemplateItem;
use App\Repositories\HearingRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class HearingService extends BaseService
{
    public function __construct(HearingRepository $repository)
    {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'Hearing';
    }

    /**
     * Contactに関連するHearingを取得
     */
    public function getByContact(string $contactId): Collection
    {
        return $this->repository->getByContact($contactId);
    }

    /**
     * 質問項目をカテゴリごとにグルーピングして取得（有効なもののみ）
     *
     * @return \Illuminate\Support\Collection<string, Collection<int, HearingTemplateItem>>
     */
    public function getGroupedTemplateItems(): \Illuminate\Support\Collection
    {
        return HearingTemplateItem::active()->ordered()->get()->groupBy('category');
    }

    /**
     * ヒアリングを回答とともに新規作成
     *
     * @param array $data title, notes, contact_id, quote_id, created_by
     * @param array<int, array{hearing_template_item_id: string, answer_text?: string, answer_options?: array}> $answers
     */
    public function createWithAnswers(array $data, array $answers): Hearing
    {
        return DB::transaction(function () use ($data, $answers) {
            $hearing = $this->repository->create($data);
            $this->syncAnswers($hearing, $answers);

            return $hearing->load(['contact', 'quote', 'creator', 'answers.templateItem']);
        });
    }

    /**
     * ヒアリングの基本情報・回答を更新
     *
     * @param array<int, array{hearing_template_item_id: string, answer_text?: string, answer_options?: array}> $answers
     */
    public function updateWithAnswers(Hearing $hearing, array $data, array $answers): Hearing
    {
        return DB::transaction(function () use ($hearing, $data, $answers) {
            $this->repository->update($hearing, $data);
            $hearing->answers()->delete();
            $this->syncAnswers($hearing, $answers);

            return $hearing->load(['contact', 'quote', 'creator', 'answers.templateItem']);
        });
    }

    /**
     * @param array<int, array{hearing_template_item_id: string, answer_text?: string, answer_options?: array}> $answers
     */
    private function syncAnswers(Hearing $hearing, array $answers): void
    {
        foreach ($answers as $answer) {
            if (empty($answer['hearing_template_item_id'])) {
                continue;
            }

            $hasText = !empty($answer['answer_text']);
            $hasOptions = !empty($answer['answer_options']);

            // 未回答の項目は保存しない
            if (!$hasText && !$hasOptions) {
                continue;
            }

            $hearing->answers()->create([
                'hearing_template_item_id' => $answer['hearing_template_item_id'],
                'answer_text' => $answer['answer_text'] ?? null,
                'answer_options' => $answer['answer_options'] ?? null,
            ]);
        }
    }
}
