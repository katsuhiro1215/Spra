<?php

namespace App\Http\Controllers\Admin\Schedule;

use App\Http\Controllers\Controller;
use App\Http\Requests\HolidayRequest;
use App\Models\Holiday;
use App\Services\HolidayService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Inertia\Inertia;

class HolidayController extends Controller
{
    /**
     * 初期化
     * @param  \App\Services\HolidayService  $holidayService
     * @return void
     */
    public function __construct(
        private HolidayService $holidayService
    ) {}

    /**
     * 休業日一覧表示
     */
    public function index(Request $request): Response
    {
        // フィルタとソートの処理
        $filters = [
            'search' => $request->input('search'),
            'type' => $request->input('type'),
            'year' => $request->input('year', date('Y')), // デフォルトは今年
            'is_recurring' => $request->input('is_recurring'),
        ];

        $sort = [
            'field' => $request->input('sort_field', 'date'),
            'direction' => $request->input('sort_direction', 'asc'),
        ];

        // 年でフィルタリングした全件を取得（ページネーションなし）
        $holidays = $this->holidayService->getFilteredHolidays($filters, $sort);

        // 利用可能な年の一覧を取得
        $availableYears = $this->holidayService->getAvailableYears();

        // 年がない場合は現在の年を追加
        if (empty($availableYears)) {
            $availableYears = [(int)date('Y')];
        }

        return Inertia::render('Admin/Holidays/Index', [
            'holidays' => $holidays,
            'filters' => $filters,
            'sort' => $sort,
            'availableYears' => $availableYears,
        ]);
    }

    /**
     * 休業日作成画面表示
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Holidays/Create');
    }

    /**
     * 休業日作成処理
     */
    public function store(HolidayRequest $request): RedirectResponse
    {
        // 一括登録の場合
        if ($request->has('holidays')) {
            $result = $this->holidayService->createBulkHolidays($request->validated()['holidays']);

            $message = "{$result['created']}件の祝日を登録しました。";
            if ($result['skipped'] > 0) {
                $message .= " ({$result['skipped']}件は既に存在するためスキップされました)";
            }

            if (!empty($result['errors'])) {
                return redirect()->route('admin.holidays.index')
                    ->with('warning', $message)
                    ->with('import_errors', $result['errors']);
            }

            return redirect()->route('admin.holidays.index')
                ->with('success', $message);
        }

        // 単一登録の場合
        $holiday = $this->holidayService->createHoliday($request->validated());

        return redirect()->route('admin.holidays.index')
            ->with('success', __('messages.registered', ['attribute' => '祝日']));
    }

    /**
     * Excelファイルからインポート
     */
    public function import(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls|max:2048',
        ], [
            'file.required' => 'ファイルを選択してください。',
            'file.mimes' => 'Excel形式のファイル(.xlsx, .xls)を選択してください。',
            'file.max' => 'ファイルサイズは2MB以下にしてください。',
        ]);

        try {
            $result = $this->holidayService->importFromExcel($request->file('file'));

            $message = "{$result['created']}件の祝日をインポートしました。";
            if ($result['skipped'] > 0) {
                $message .= " ({$result['skipped']}件は既に存在するためスキップされました)";
            }

            if (!empty($result['errors'])) {
                return redirect()->route('admin.holidays.index')
                    ->with('warning', $message)
                    ->with('import_errors', $result['errors']);
            }

            return redirect()->route('admin.holidays.index')
                ->with('success', $message);
        } catch (\Exception $e) {
            return back()
                ->with('error', __('messages.action_failed_detail', ['attribute' => 'インポート', 'message' => $e->getMessage()]));
        }
    }

    /**
     * 休業日編集画面表示
     */
    public function edit(Holiday $holiday): Response
    {
        return Inertia::render('Admin/Holidays/Edit', [
            'holiday' => $holiday,
        ]);
    }

    /**
     * 休業日更新処理
     */
    public function update(HolidayRequest $request, Holiday $holiday): RedirectResponse
    {
        $this->holidayService->updateHoliday($holiday, $request->validated());

        return redirect()->route('admin.holidays.index')
            ->with('success', __('messages.updated', ['attribute' => '祝日']));
    }

    /**
     * 休業日削除処理
     */
    public function destroy(Holiday $holiday): RedirectResponse
    {
        try {
            $this->holidayService->deleteHoliday($holiday);

            return redirect()->route('admin.holidays.index')
                ->with('success', __('messages.deleted', ['attribute' => '祝日']));
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
