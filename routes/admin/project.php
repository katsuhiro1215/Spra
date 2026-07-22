<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\Project\ProjectTemplateController;
use App\Http\Controllers\Admin\Project\ProjectTemplateMilestoneController;
use App\Http\Controllers\Admin\Project\ProjectController;
use App\Http\Controllers\Admin\Project\ProjectVersionController;
use App\Http\Controllers\Admin\Project\ProjectMilestoneController;
use App\Http\Controllers\Admin\Project\ProjectItemController;
use App\Http\Controllers\Admin\Project\ProjectUpdateController;
use App\Http\Controllers\Admin\Project\GanttChartController;
use App\Http\Controllers\Admin\Project\ProjectDocumentController;
use App\Http\Controllers\Admin\Project\ProjectDocumentVersionController;
use App\Http\Controllers\Admin\Project\ProjectDocumentSectionController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

// プロジェクト関連のマイルストーンとアップデート管理
Route::prefix('project')->name('project.')->group(function () {
    // ProjectTemplate
    Route::resource('template', ProjectTemplateController::class);

    // ProjectTemplateMilestone (ネストされたリソース)
    Route::prefix('template/{projectTemplate}')->name('template.')->group(function () {
        Route::resource('milestone', ProjectTemplateMilestoneController::class)->except(['index']);
    });

    // ProjectMilestone
    Route::post('/{project}/milestones', [ProjectMilestoneController::class, 'store'])->name('milestones.store');
    Route::put('/{project}/milestones/{milestone}', [ProjectMilestoneController::class, 'update'])->name('milestones.update');
    Route::delete('/{project}/milestones/{milestone}', [ProjectMilestoneController::class, 'destroy'])->name('milestones.destroy');
    // Updates
    Route::post('/{project}/updates', [ProjectUpdateController::class, 'store'])->name('updates.store');
    Route::put('/{project}/updates/{update}', [ProjectUpdateController::class, 'update'])->name('updates.update');
    Route::delete('/{project}/updates/{update}', [ProjectUpdateController::class, 'destroy'])->name('updates.destroy');
    // ガントチャート
    Route::get('/gantt', [GanttChartController::class, 'index'])->name('gantt.index');
    Route::get('/{project}/gantt', [GanttChartController::class, 'show'])->name('gantt.show');
});
// Project
Route::resource('project', ProjectController::class);

// ProjectVersion ネストされたリソース
Route::prefix('project/{project}')->name('project.')->group(function () {
    Route::resource('versions', ProjectVersionController::class);
    Route::post('versions/{version}/set-current', [ProjectVersionController::class, 'setCurrent'])->name('versions.setCurrent');

    // ProjectMilestone ネストされたリソース
    Route::prefix('versions/{version}')->name('versions.')->group(function () {
        Route::resource('milestones', ProjectMilestoneController::class)->except(['index']);
        // ProjectItem ネストされたリソース
        Route::resource('items', ProjectItemController::class)->except(['index']);
    });

    // ProjectDocument（設計文書の中央管理）
    Route::resource('documents', ProjectDocumentController::class)->except(['create', 'edit']);

    Route::prefix('documents/{document}')->name('documents.')->group(function () {
        // 版を確定（現在のドラフトをreleasedにし、次のドラフトを複製発行）
        Route::post('versions', [ProjectDocumentVersionController::class, 'store'])->name('versions.store');
        Route::get('versions/{version}/pdf', [ProjectDocumentVersionController::class, 'pdf'])->name('versions.pdf');
        // バージョン間の差分比較
        Route::get('compare', [ProjectDocumentController::class, 'compare'])->name('compare');

        // ProjectDocumentSection（現在のドラフト版に対する操作）
        Route::post('sections', [ProjectDocumentSectionController::class, 'store'])->name('sections.store');
        Route::put('sections/{section}', [ProjectDocumentSectionController::class, 'update'])->name('sections.update');
        Route::put('sections/{section}/details', [ProjectDocumentSectionController::class, 'updateDetails'])->name('sections.updateDetails');
        Route::delete('sections/{section}', [ProjectDocumentSectionController::class, 'destroy'])->name('sections.destroy');
        Route::post('sections/reorder', [ProjectDocumentSectionController::class, 'reorder'])->name('sections.reorder');
        Route::get('sections/{section}/migration', [ProjectDocumentSectionController::class, 'migration'])->name('sections.migration');
    });
});
