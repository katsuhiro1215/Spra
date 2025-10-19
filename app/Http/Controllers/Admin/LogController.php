<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class LogController extends Controller
{
  /**
   * ログ一覧画面
   */
  public function index(Request $request)
  {
    // TODO: ログデータ取得処理を実装
    // 今はダミーデータで返す
    $logs = [
      'activity' => [],
      'event' => [],
      'warning' => [],
      'login' => [],
    ];
    return Inertia::render('Admin/Logs/Index', [
      'logs' => $logs,
    ]);
  }
}
