<?php

namespace App\Services;

use App\Repositories\Contracts\BaseRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * 基底サービス抽象クラス
 * 
 * ビジネスロジックの基本的な処理を実装
 * 各具体的なサービスはこのクラスを継承して使用する
 */
abstract class BaseService
{
  /**
   * リポジトリインスタンス
   * 
   * @var BaseRepositoryInterface
   */
  protected BaseRepositoryInterface $repository;

  /**
   * コンストラクタ
   * 
   * @param BaseRepositoryInterface $repository
   */
  public function __construct(BaseRepositoryInterface $repository)
  {
    $this->repository = $repository;
  }

  /**
   * エンティティ名を返す（単数形）
   * ログやエラーメッセージで使用
   * 
   * @return string
   */
  abstract protected function getEntityName(): string;

  /**
   * エンティティ名を返す（複数形）
   * 
   * @return string
   */
  protected function getEntityNamePlural(): string
  {
    return $this->getEntityName() . 's';
  }

  /**
   * ページネーション付きでエンティティ一覧を取得
   * 
   * @param array $filters
   * @param array $sort
   * @param int $perPage
   * @return LengthAwarePaginator
   */
  public function getPaginated(
    array $filters = [],
    array $sort = [],
    int $perPage = 20
  ): LengthAwarePaginator {
    return $this->repository->paginate($perPage, $filters, $sort);
  }

  /**
   * IDでエンティティを検索
   * 
   * @param string $id
   * @return mixed|null
   */
  public function findById(string $id): mixed
  {
    return $this->repository->findById($id);
  }

  /**
   * 統計情報を取得
   * 
   * @return array
   */
  public function getStats(): array
  {
    return $this->repository->getStats();
  }

  /**
   * エンティティを作成
   * 
   * @param array $data
   * @return mixed
   */
  public function create(array $data): mixed
  {
    try {
      return DB::transaction(function () use ($data) {
        $entity = $this->repository->create($data);

        $this->logInfo('created', $entity->id ?? null);

        return $entity;
      });
    } catch (\Exception $e) {
      $this->logError('create_failed', $e);
      throw $e;
    }
  }

  /**
   * エンティティを更新
   * 
   * @param mixed $model
   * @param array $data
   * @return mixed
   */
  public function update(mixed $model, array $data): mixed
  {
    try {
      return DB::transaction(function () use ($model, $data) {
        $entity = $this->repository->update($model, $data);

        $this->logInfo('updated', $entity->id ?? null);

        return $entity;
      });
    } catch (\Exception $e) {
      $this->logError('update_failed', $e, $model->id ?? null);
      throw $e;
    }
  }

  /**
   * エンティティを削除
   * 
   * @param mixed $model
   * @return bool
   */
  public function delete(mixed $model): bool
  {
    try {
      return DB::transaction(function () use ($model) {
        $id = $model->id ?? null;
        $result = $this->repository->delete($model);

        if ($result) {
          $this->logInfo('deleted', $id);
        }

        return $result;
      });
    } catch (\Exception $e) {
      $this->logError('delete_failed', $e, $model->id ?? null);
      throw $e;
    }
  }

  /**
   * ログ出力（情報）
   * 
   * @param string $action
   * @param string|null $id
   * @param array $context
   * @return void
   */
  protected function logInfo(string $action, ?string $id = null, array $context = []): void
  {
    $message = sprintf(
      '%s %s',
      $this->getEntityName(),
      $action
    );

    $context = array_merge(
      ['entity' => $this->getEntityName()],
      $id ? ['id' => $id] : [],
      $context
    );

    Log::info($message, $context);
  }

  /**
   * ログ出力（エラー）
   * 
   * @param string $action
   * @param \Exception $exception
   * @param string|null $id
   * @param array $context
   * @return void
   */
  protected function logError(
    string $action,
    \Exception $exception,
    ?string $id = null,
    array $context = []
  ): void {
    $message = sprintf(
      '%s %s: %s',
      $this->getEntityName(),
      $action,
      $exception->getMessage()
    );

    $context = array_merge(
      [
        'entity' => $this->getEntityName(),
        'error' => $exception->getMessage(),
        'trace' => $exception->getTraceAsString(),
      ],
      $id ? ['id' => $id] : [],
      $context
    );

    Log::error($message, $context);
  }
}
