<?php

namespace App\Helpers;

class InertiaHelper
{
  /**
   * Inertiaコンポーネントのパスを検証
   */
  public static function validateComponentPath(string $component): bool
  {
    $componentPath = resource_path("js/Pages/{$component}.jsx");
    return file_exists($componentPath);
  }

  /**
   * 利用可能なコンポーネント一覧を取得
   */
  public static function getAvailableComponents(): array
  {
    $pagesPath = resource_path('js/Pages');
    $components = [];

    if (is_dir($pagesPath)) {
      $iterator = new \RecursiveIteratorIterator(
        new \RecursiveDirectoryIterator($pagesPath)
      );

      foreach ($iterator as $file) {
        if ($file->isFile() && $file->getExtension() === 'jsx') {
          $relativePath = str_replace($pagesPath . '/', '', $file->getPathname());
          $componentName = str_replace('.jsx', '', $relativePath);
          $components[] = str_replace('/', '.', $componentName);
        }
      }
    }

    return $components;
  }
}
