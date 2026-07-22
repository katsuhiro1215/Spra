<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\PayrollService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PayrollController extends Controller
{
    public function __construct(private PayrollService $payrollService) {}

    /**
     * 給与計算（月次・リアルタイム集計）
     */
    public function index(Request $request): Response
    {
        $year = (int) $request->input('year', now()->year);
        $month = (int) $request->input('month', now()->month);

        return Inertia::render('Admin/Payroll/Index', [
            'payrolls' => $this->payrollService->calculateForMonth($year, $month),
            'currentYear' => $year,
            'currentMonth' => $month,
        ]);
    }
}
