<?php

namespace App\Services;

use App\Models\ProjectInquiry;
use App\Repositories\ProjectInquiryRepository;
use Illuminate\Support\Facades\DB;

class ProjectInquiryService extends BaseService
{
  /**
   * コンストラクタ
   * 
   * @param ProjectInquiryRepository $repository
   */
  public function __construct(ProjectInquiryRepository $repository)
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
    return 'ProjectInquiry';
  }

  /**
   * 見積もりシミュレーターから問い合わせを作成
   * 
   * @param array $data
   * @param string $userId
   * @return ProjectInquiry
   */
  public function createFromEstimateSimulator(array $data, string $userId): ProjectInquiry
  {
    return DB::transaction(function () use ($data, $userId) {
      // 問い合わせコードを生成
      $inquiryCode = $this->generateInquiryCode();

      $inquiryData = [
        'inquiry_code' => $inquiryCode,
        'user_id' => $userId,
        'service_category_id' => $data['service_category_id'],
        'service_id' => $data['service_id'],
        'service_plan_id' => $data['service_plan_id'],
        'simulator_data' => $data['simulator_data'],
        'estimated_price' => $data['estimated_price'],
        'estimated_days' => $data['estimated_days'],
        'title' => $data['title'],
        'summary' => $data['summary'] ?? null,
        'status' => 'new',
      ];

      return $this->repository->create($inquiryData);
    });
  }

  /**
   * 問い合わせコードを生成
   * 
   * @return string
   */
  private function generateInquiryCode(): string
  {
    $prefix = 'INQ';
    $date = now()->format('Ymd');
    $random = strtoupper(substr(uniqid(), -6));

    return "{$prefix}-{$date}-{$random}";
  }

  /**
   * ユーザーの問い合わせを取得
   * 
   * @param string $userId
   * @return \Illuminate\Database\Eloquent\Collection
   */
  public function getByUser(string $userId)
  {
    return $this->repository->query()
      ->where('user_id', $userId)
      ->orderBy('created_at', 'desc')
      ->get();
  }
}
