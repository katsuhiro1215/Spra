<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\LegacyDocumentController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

Route::resource('legacy-document', LegacyDocumentController::class)->only(['index', 'store']);
