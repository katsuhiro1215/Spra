<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JapaneseLocalizationTest extends TestCase
{
  use RefreshDatabase;

  /**
   * 日本語バリデーションメッセージのテスト
   */
  public function test_japanese_validation_messages()
  {
    // 日本語ロケールが設定されていることを確認
    $this->assertEquals('ja', app()->getLocale());

    // バリデーションエラーメッセージが日本語で表示されることを確認
    $response = $this->post('/admin/service/service-types', [
      'name' => '', // 必須フィールドを空にする
      'email' => 'invalid-email', // 無効なメール形式
    ]);

    // 日本語のエラーメッセージが含まれることを確認
    $response->assertSessionHasErrors([
      'name' => '名前は必須です。',
    ]);
  }

  /**
   * 認証関連の日本語メッセージテスト
   */
  public function test_japanese_auth_messages()
  {
    // 間違ったログイン情報でのテスト
    $response = $this->post('/admin/login', [
      'email' => 'wrong@example.com',
      'password' => 'wrongpassword',
    ]);

    // 日本語の認証エラーメッセージが表示されることを確認
    $response->assertSessionHas('error', function ($message) {
      return str_contains($message, 'ログイン情報が正しくありません');
    });
  }

  /**
   * パスワードリセット関連の日本語メッセージテスト
   */
  public function test_japanese_password_reset_messages()
  {
    // 存在しないメールアドレスでパスワードリセットを試行
    $response = $this->post('/admin/forgot-password', [
      'email' => 'nonexistent@example.com',
    ]);

    // 日本語のエラーメッセージが表示されることを確認
    $response->assertSessionHas('error', function ($message) {
      return str_contains($message, 'メールアドレスのユーザーが見つかりません');
    });
  }

  /**
   * ページネーション関連の日本語表示テスト
   */
  public function test_japanese_pagination()
  {
    // 多数のサービスタイプを作成
    \App\Models\ServiceType::factory()->count(20)->create();

    $response = $this->get('/admin/service/service-types');

    // 日本語のページネーションリンクが表示されることを確認
    $response->assertSee('前');
    $response->assertSee('次');
  }

  /**
   * カスタム属性名の日本語表示テスト
   */
  public function test_custom_attribute_names()
  {
    // ServiceTypeの作成でバリデーションエラーを発生させる
    $response = $this->post('/admin/service/service-types', [
      'service_category_id' => '',
      'base_price' => 'invalid-price',
    ]);

    // カスタム属性名が日本語で表示されることを確認
    $response->assertSessionHasErrors();

    $errors = session('errors');
    if ($errors) {
      $this->assertStringContains('サービスカテゴリ', $errors->first('service_category_id'));
      $this->assertStringContains('基本価格', $errors->first('base_price'));
    }
  }
}
