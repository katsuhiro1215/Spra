<?php

namespace App\Services;

use App\Models\ResponseTemplate;
use App\Repositories\ResponseTemplateRepository;
use Illuminate\Support\Facades\DB;

class ResponseTemplateService extends BaseService
{
    /**
     * コンストラクタ
     * 
     * @param ResponseTemplateRepository $repository
     */
    public function __construct(ResponseTemplateRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * エンティティ名を返す
     * 
     * @return string
     */
    protected function getEntityName(): string
    {
        return 'ResponseTemplate';
    }

    /**
     * カテゴリで取得
     * 
     * @param string $category
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByCategory(string $category)
    {
        return $this->repository->getByCategory($category);
    }

    /**
     * 有効なテンプレートを取得
     * 
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActive()
    {
        return $this->repository->getActive();
    }

    /**
     * 新しいResponseTemplateを作成
     * 
     * @param array $data
     * @return ResponseTemplate
     */
    public function createResponseTemplate(array $data): ResponseTemplate
    {
        return DB::transaction(function () use ($data) {
            return $this->repository->create($data);
        });
    }

    /**
     * ResponseTemplateを更新
     * 
     * @param ResponseTemplate $template
     * @param array $data
     * @return ResponseTemplate
     */
    public function updateResponseTemplate(ResponseTemplate $template, array $data): ResponseTemplate
    {
        return DB::transaction(function () use ($template, $data) {
            $this->repository->update($template, $data);
            return $template->fresh();
        });
    }

    /**
     * ResponseTemplateを削除
     * 
     * @param ResponseTemplate $template
     * @throws \Exception
     */
    public function deleteResponseTemplate(ResponseTemplate $template): void
    {
        // 使用されているテンプレートは削除できない
        if ($template->responses()->exists()) {
            throw new \Exception('使用されている返答テンプレートは削除できません。');
        }

        DB::transaction(function () use ($template) {
            $this->repository->delete($template);
        });
    }

    /**
     * ステータス定義を取得
     * 
     * @return array
     */
    public function getStatuses(): array
    {
        return [
            'active' => '有効',
            'inactive' => '無効',
        ];
    }

    /**
     * カテゴリ定義を取得
     * 
     * @return array
     */
    public function getCategories(): array
    {
        return [
            'general' => '一般',
            'estimate' => '見積もり',
            'technical' => '技術',
            'sales' => '営業',
            'support' => 'サポート',
            'other' => 'その他',
        ];
    }

    /**
     * 利用可能なプレースホルダーを取得
     * 
     * @return array
     */
    public function getAvailablePlaceholders(): array
    {
        return ResponseTemplate::getAvailablePlaceholders();
    }
}
