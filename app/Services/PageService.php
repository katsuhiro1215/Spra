<?php

namespace App\Services;

use App\Models\Page;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class PageService
{
  /**
   * 新しいページ作成
   *
   * @param array $data
   * @return Page
   */
  public function createPage(array $data): Page
  {
    return DB::transaction(function () use ($data) {
      // デフォルト値の設定
      $data = $this->setDefaultValues($data);

      // 作成者情報の追加
      $data['created_by'] = Auth::guard('admins')->id();

      return Page::create($data);
    });
  }

  /**
   * ページを更新
   * 
   * @param Page $page
   * @param array $data
   * @return Page
   */
  public function updatePage(Page $page, array $data): Page
  {
    return DB::transaction(function () use ($page, $data) {
      // 更新者情報の追加
      $data['updated_by'] = Auth::guard('admins')->id();

      $page->update($data);

      return $page->fresh();
    });
  }

  /**
   * ページを削除
   */
  public function deletePage(Page $page): bool
  {
    return DB::transaction(function () use ($page) {

      return $page->delete();
    });
  }

  /**
   * サービスタイプを複製
   */
  public function duplicatePage(Page $originalPage): Page
  {
    return DB::transaction(function () use ($originalPage) {
      $data = $originalPage->toArray();

      // 複製時に除外するフィールド
      unset($data['id'], $data['created_at'], $data['updated_at']);

      // タイトルとスラッグを調整
      $data['title'] = $data['title'] . ' (コピー)';
      $data['slug'] = $data['slug'] ? $data['slug'] . '-copy-' . time() : null;

      // 作成者情報の設定
      $data['created_by'] = Auth::guard('admins')->id();
      $data['updated_by'] = null;

      return Page::create($data);
    });
  }
}

