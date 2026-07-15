<?php

namespace App\Services;

use App\Models\Holiday;
use App\Models\ScheduleDefault;
use App\Models\ScheduleException;
use Carbon\Carbon;
use Illuminate\Support\Collection;

/**
 * スケジュール管理サービス
 *
 * デフォルトスケジュール、例外、休日を統合して
 * 利用可能な時間枠を計算するビジネスロジックを提供
 */
class ScheduleService
{
  /**
   * 指定日が営業日かどうかを判定
   *
   * @param Carbon $date
   * @return bool
   */
  public function isBusinessDay(Carbon $date): bool
  {
    // 1. 休日チェック
    if ($this->isHoliday($date)) {
      return false;
    }

    // 2. 例外日チェック
    $exception = $this->getException($date);
    if ($exception) {
      return $exception->is_open;
    }

    // 3. デフォルトスケジュールチェック
    $default = $this->getDefaultSchedule($date->dayOfWeek);
    return $default ? $default->is_open : false;
  }

  /**
   * 指定日が休日かどうかを判定
   *
   * @param Carbon $date
   * @return bool
   */
  public function isHoliday(Carbon $date): bool
  {
    return Holiday::where('date', $date->format('Y-m-d'))
      ->exists();
  }

  /**
   * 指定日の例外スケジュールを取得
   *
   * @param Carbon $date
   * @return ScheduleException|null
   */
  public function getException(Carbon $date): ?ScheduleException
  {
    return ScheduleException::where('exception_date', $date->format('Y-m-d'))
      ->first();
  }

  /**
   * 指定曜日のデフォルトスケジュールを取得
   *
   * @param int $dayOfWeek 0=日曜, 6=土曜
   * @return ScheduleDefault|null
   */
  public function getDefaultSchedule(int $dayOfWeek): ?ScheduleDefault
  {
    return ScheduleDefault::where('day_of_week', $dayOfWeek)->first();
  }

  /**
   * 指定日の営業時間を取得
   *
   * @param Carbon $date
   * @return array{open_time: string|null, close_time: string|null, break_start: string|null, break_end: string|null}|null
   */
  public function getBusinessHours(Carbon $date): ?array
  {
    // 休日は営業時間なし
    if ($this->isHoliday($date)) {
      return null;
    }

    // 例外日の営業時間をチェック
    $exception = $this->getException($date);
    if ($exception) {
      if (!$exception->is_open) {
        return null;
      }
      return [
        'open_time' => $exception->open_time,
        'close_time' => $exception->close_time,
        'break_start' => $exception->break_start,
        'break_end' => $exception->break_end,
      ];
    }

    // デフォルトスケジュールの営業時間
    $default = $this->getDefaultSchedule($date->dayOfWeek);
    if (!$default || !$default->is_open) {
      return null;
    }

    return [
      'open_time' => $default->open_time,
      'close_time' => $default->close_time,
      'break_start' => $default->break_start,
      'break_end' => $default->break_end,
    ];
  }

  /**
   * 指定日の利用可能な時間枠を生成
   *
   * @param Carbon $date
   * @param int $intervalMinutes スロット間隔（分）
   * @param int $durationMinutes 予約時間（分）
   * @return Collection<int, array{start: string, end: string, label: string}>
   */
  public function getAvailableTimeSlots(
    Carbon $date,
    int $intervalMinutes = 30,
    int $durationMinutes = 60
  ): Collection {
    $hours = $this->getBusinessHours($date);

    if (!$hours || !$hours['open_time'] || !$hours['close_time']) {
      return collect();
    }

    $slots = collect();
    $current = Carbon::parse($date->format('Y-m-d') . ' ' . $hours['open_time']);
    $closeTime = Carbon::parse($date->format('Y-m-d') . ' ' . $hours['close_time']);

    // 休憩時間
    $breakStart = $hours['break_start']
      ? Carbon::parse($date->format('Y-m-d') . ' ' . $hours['break_start'])
      : null;
    $breakEnd = $hours['break_end']
      ? Carbon::parse($date->format('Y-m-d') . ' ' . $hours['break_end'])
      : null;

    while ($current->copy()->addMinutes($durationMinutes)->lte($closeTime)) {
      $slotEnd = $current->copy()->addMinutes($durationMinutes);

      // 休憩時間と重複しないかチェック
      $isBreakTime = false;
      if ($breakStart && $breakEnd) {
        // スロットが休憩時間と重複する場合はスキップ
        if ($current->lt($breakEnd) && $slotEnd->gt($breakStart)) {
          $isBreakTime = true;
        }
      }

      if (!$isBreakTime) {
        $slots->push([
          'start' => $current->format('H:i'),
          'end' => $slotEnd->format('H:i'),
          'label' => $current->format('H:i') . ' - ' . $slotEnd->format('H:i'),
        ]);
      }

      $current->addMinutes($intervalMinutes);
    }

    return $slots;
  }

  /**
   * 指定期間の営業日カレンダーを生成
   *
   * 期間内の休日・例外日・デフォルトスケジュールを事前に一括取得し、
   * 1日ごとにDBへ問い合わせるN+1を避ける。
   *
   * @param Carbon $startDate
   * @param Carbon $endDate
   * @return Collection<string, array{date: string, is_business_day: bool, is_holiday: bool, holiday_name: string|null, hours: array|null}>
   */
  public function getBusinessCalendar(Carbon $startDate, Carbon $endDate): Collection
  {
    $holidays = Holiday::whereBetween('date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
      ->get()
      ->keyBy(fn (Holiday $holiday) => $holiday->date->format('Y-m-d'));

    $exceptions = ScheduleException::whereBetween('exception_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
      ->get()
      ->keyBy(fn (ScheduleException $exception) => $exception->exception_date->format('Y-m-d'));

    $defaults = ScheduleDefault::all()->keyBy('day_of_week');

    $calendar = collect();
    $current = $startDate->copy();

    while ($current->lte($endDate)) {
      $dateKey = $current->format('Y-m-d');
      $holiday = $holidays->get($dateKey);
      $exception = $exceptions->get($dateKey);
      $default = $defaults->get($current->dayOfWeek);

      $isHoliday = $holiday !== null;
      $isBusinessDay = $isHoliday
        ? false
        : ($exception ? $exception->is_open : ($default?->is_open ?? false));

      $hours = null;
      if ($isBusinessDay) {
        $source = $exception ?? $default;
        $hours = [
          'open_time' => $source->open_time,
          'close_time' => $source->close_time,
          'break_start' => $source->break_start,
          'break_end' => $source->break_end,
        ];
      }

      $calendar->put($dateKey, [
        'date' => $dateKey,
        'is_business_day' => $isBusinessDay,
        'is_holiday' => $isHoliday,
        'holiday_name' => $holiday?->name,
        'is_exception' => $exception !== null,
        'exception_reason' => $exception?->reason,
        'hours' => $hours,
        'day_of_week' => $current->dayOfWeek,
        'day_name' => ['日', '月', '火', '水', '木', '金', '土'][$current->dayOfWeek],
      ]);

      $current->addDay();
    }

    return $calendar;
  }

  /**
   * 指定日時が予約可能かどうかを判定
   *
   * @param Carbon $dateTime
   * @param int $durationMinutes
   * @return bool
   */
  public function isTimeAvailable(Carbon $dateTime, int $durationMinutes = 60): bool
  {
    $date = $dateTime->copy()->startOfDay();
    $hours = $this->getBusinessHours($date);

    if (!$hours || !$hours['open_time'] || !$hours['close_time']) {
      return false;
    }

    $openTime = Carbon::parse($date->format('Y-m-d') . ' ' . $hours['open_time']);
    $closeTime = Carbon::parse($date->format('Y-m-d') . ' ' . $hours['close_time']);
    $endTime = $dateTime->copy()->addMinutes($durationMinutes);

    // 営業時間内かチェック
    if ($dateTime->lt($openTime) || $endTime->gt($closeTime)) {
      return false;
    }

    // 休憩時間と重複しないかチェック
    if ($hours['break_start'] && $hours['break_end']) {
      $breakStart = Carbon::parse($date->format('Y-m-d') . ' ' . $hours['break_start']);
      $breakEnd = Carbon::parse($date->format('Y-m-d') . ' ' . $hours['break_end']);

      if ($dateTime->lt($breakEnd) && $endTime->gt($breakStart)) {
        return false;
      }
    }

    return true;
  }

  /**
   * 次の営業日を取得
   *
   * @param Carbon $date
   * @param int $maxDays 最大検索日数
   * @return Carbon|null
   */
  public function getNextBusinessDay(Carbon $date, int $maxDays = 30): ?Carbon
  {
    $current = $date->copy()->addDay();
    $count = 0;

    while ($count < $maxDays) {
      if ($this->isBusinessDay($current)) {
        return $current;
      }
      $current->addDay();
      $count++;
    }

    return null;
  }

  /**
   * 指定月の休日一覧を取得
   *
   * @param int $year
   * @param int $month
   * @return Collection
   */
  public function getHolidaysForMonth(int $year, int $month): Collection
  {
    $startDate = Carbon::create($year, $month, 1)->startOfMonth();
    $endDate = $startDate->copy()->endOfMonth();

    return Holiday::whereBetween('date', [
      $startDate->format('Y-m-d'),
      $endDate->format('Y-m-d'),
    ])
      ->orderBy('date')
      ->get();
  }
}
