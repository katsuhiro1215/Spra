<?php

namespace App\Http\Controllers\Admin\Schedule;

use App\Http\Controllers\Controller;
use App\Http\Requests\ScheduleExceptionRequest;
use App\Models\ScheduleException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleExceptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        // フィルタの処理
        $filters = [
            'search' => $request->input('search'),
            'year' => $request->input('year', date('Y')), // デフォルトは今年
            'is_open' => $request->input('is_open'),
        ];

        // クエリを構築
        $query = ScheduleException::query();

        // 検索条件を適用
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('reason', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('notes', 'like', '%' . $filters['search'] . '%');
            });
        }

        // 年フィルター
        if (!empty($filters['year'])) {
            $query->whereYear('exception_date', $filters['year']);
        }

        // 営業状態フィルター
        if (isset($filters['is_open']) && $filters['is_open'] !== '') {
            $query->where('is_open', (bool)$filters['is_open']);
        }

        // 年でフィルタリングした全件を取得（ページネーションなし）
        $exceptions = $query->orderBy('exception_date', 'desc')->get();

        // 利用可能な年の一覧を取得
        $availableYears = ScheduleException::selectRaw('YEAR(exception_date) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();

        // 年がない場合は現在の年を追加
        if (empty($availableYears)) {
            $availableYears = [(int)date('Y')];
        }

        return Inertia::render('Admin/Schedules/Exceptions/Index', [
            'exceptions' => $exceptions,
            'filters' => $filters,
            'availableYears' => $availableYears,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Schedules/Exceptions/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ScheduleExceptionRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        ScheduleException::create([
            ...$validated,
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('admin.schedules.exceptions.index')
            ->with('success', '例外日を登録しました。');
    }

    /**
     * Display the specified resource.
     */
    public function show(ScheduleException $exception): Response
    {
        return Inertia::render('Admin/Schedules/Exceptions/Show', [
            'exception' => $exception,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ScheduleException $exception): Response
    {
        return Inertia::render('Admin/Schedules/Exceptions/Edit', [
            'exception' => $exception,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ScheduleExceptionRequest $request, ScheduleException $exception): RedirectResponse
    {
        $validated = $request->validated();

        $exception->update([
            ...$validated,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('admin.schedules.exceptions.index')
            ->with('success', '例外日を更新しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ScheduleException $exception): RedirectResponse
    {
        $exception->update(['deleted_by' => auth()->id()]);
        $exception->delete();

        return redirect()->route('admin.schedules.exceptions.index')
            ->with('success', '例外日を削除しました。');
    }
}
