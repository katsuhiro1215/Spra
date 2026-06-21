<?php

namespace App\Services;

use App\Models\Holiday;
use App\Repositories\HolidayRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class HolidayService
{
  // Repository
  public function __construct(
    private HolidayRepository $repository
  ) {}

  /**
   * ページネーション付きでHolidayを取得
   *
   * @return LengthAwarePaginator
   */
  public function getPaginatedHolidays(array $filters, array $sort, int $perPage = 20): LengthAwarePaginator
  {
    $query = Holiday::query();

    // フィルター適用
    if (!empty($filters['search'])) {
      $query = $this->repository->buildSearchQuery($query, $filters['search']);
    }

    if (!empty($filters['type'])) {
      $query = $this->repository->buildTypeFilter($query, $filters['type']);
    }

    if (isset($filters['is_recurring']) && $filters['is_recurring'] !== '') {
      $query = $this->repository->buildIsRecurringFilter($query, (bool)$filters['is_recurring']);
    }

    if (!empty($filters['year'])) {
      $query = $this->repository->buildYearFilter($query, (int)$filters['year']);
    }

    // ソート適用
    if (!empty($sort['field']) && !empty($sort['direction'])) {
      $query = $this->repository->applySorting($query, $sort['field'], $sort['direction']);
    } else {
      // デフォルトのソート
      $query = $this->repository->applySorting($query, 'date', 'asc');
    }

    return $query->paginate($perPage)->withQueryString();
  }

  /**
   * フィルター条件に基づいて全てのHolidayを取得（ページネーションなし）
   *
   * @return Collection
   */
  public function getFilteredHolidays(array $filters, array $sort): Collection
  {
    $query = Holiday::query();

    // フィルター適用
    if (!empty($filters['search'])) {
      $query = $this->repository->buildSearchQuery($query, $filters['search']);
    }

    if (!empty($filters['type'])) {
      $query = $this->repository->buildTypeFilter($query, $filters['type']);
    }

    if (isset($filters['is_recurring']) && $filters['is_recurring'] !== '') {
      $query = $this->repository->buildIsRecurringFilter($query, (bool)$filters['is_recurring']);
    }

    if (!empty($filters['year'])) {
      $query = $this->repository->buildYearFilter($query, (int)$filters['year']);
    }

    // ソート適用
    if (!empty($sort['field']) && !empty($sort['direction'])) {
      $query = $this->repository->applySorting($query, $sort['field'], $sort['direction']);
    } else {
      // デフォルトのソート
      $query = $this->repository->applySorting($query, 'date', 'asc');
    }

    return $query->get();
  }

  /**
   * 利用可能な年の一覧を取得
   *
   * @return array
   */
  public function getAvailableYears(): array
  {
    return $this->repository->getAvailableYears();
  }

  /**
   * 新しいHolidayを作成
   *
   * @param array $data
   * @return Holiday
   */
  public function createHoliday(array $data): Holiday
  {
    return DB::transaction(function () use ($data) {
      $owner = Auth::guard('owner')->user();

      // デフォルト値の設定
      $data['is_recurring'] = $data['is_recurring'] ?? false;
      $data['type'] = $data['type'] ?? 'national';
      $data['created_by'] = $owner->id;

      return Holiday::create($data);
    });
  }

  /**
   * 一括でHolidayを作成(重複をスキップ)
   *
   * @param array $holidays
   * @return array ['created' => int, 'skipped' => int, 'errors' => array]
   */
  public function createBulkHolidays(array $holidays): array
  {
    return DB::transaction(function () use ($holidays) {
      $owner = Auth::guard('owner')->user();
      $created = 0;
      $skipped = 0;
      $errors = [];

      foreach ($holidays as $index => $data) {
        try {
          // 既存チェック
          $exists = Holiday::where('date', $data['date'])->exists();

          if ($exists) {
            $skipped++;
            continue;
          }

          // デフォルト値の設定
          $data['is_recurring'] = $data['is_recurring'] ?? false;
          $data['type'] = $data['type'] ?? 'national';
          $data['created_by'] = $owner->id;

          Holiday::create($data);
          $created++;
        } catch (\Exception $e) {
          $errors[] = [
            'row' => $index + 1,
            'date' => $data['date'] ?? '',
            'name' => $data['name'] ?? '',
            'error' => $e->getMessage(),
          ];
        }
      }

      return [
        'created' => $created,
        'skipped' => $skipped,
        'errors' => $errors,
      ];
    });
  }

  /**
   * ExcelファイルからHolidayをインポート
   *
   * @param \Illuminate\Http\UploadedFile $file
   * @return array
   */
  public function importFromExcel($file): array
  {
    try {
      $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($file->getPathname());
      $sheet = $spreadsheet->getActiveSheet();
      $rows = $sheet->toArray();

      // ヘッダー行をスキップ
      array_shift($rows);

      $holidays = [];
      foreach ($rows as $row) {
        // 空行をスキップ
        if (empty($row[0]) && empty($row[1])) {
          continue;
        }

        $holidays[] = [
          'date' => $this->parseExcelDate($row[0]),
          'name' => $row[1] ?? '',
          'type' => $row[2] ?? 'national',
          'color' => $row[3] ?? null,
          'is_recurring' => isset($row[4]) ? (bool)$row[4] : false,
          'description' => $row[5] ?? null,
        ];
      }

      return $this->createBulkHolidays($holidays);
    } catch (\Exception $e) {
      throw new \Exception('Excelファイルの読み込みに失敗しました: ' . $e->getMessage());
    }
  }

  /**
   * ExcelのシリアルナンバーをY-m-d形式に変換
   */
  private function parseExcelDate($value): string
  {
    // すでに日付文字列の場合
    if (is_string($value) && strtotime($value)) {
      return date('Y-m-d', strtotime($value));
    }

    // Excelのシリアルナンバーの場合
    if (is_numeric($value)) {
      $date = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value);
      return $date->format('Y-m-d');
    }

    return $value;
  }

  /**
   * Holidayを更新
   *
   * @param Holiday $holiday
   * @param array $data
   * @return Holiday
   */
  public function updateHoliday(Holiday $holiday, array $data): Holiday
  {
    return DB::transaction(function () use ($holiday, $data) {
      // 更新者情報の追加
      $data['updated_by'] = Auth::guard('admin')->id();

      $holiday->update($data);
      return $holiday->fresh();
    });
  }

  /**
   * Holidayを削除
   */
  public function deleteHoliday(Holiday $holiday): bool
  {
    return DB::transaction(function () use ($holiday) {
      // 削除者情報の追加
      $holiday->deleted_by = Auth::guard('admin')->id();
      $holiday->save();

      return $holiday->delete();
    });
  }
}
