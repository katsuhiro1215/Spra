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
});
