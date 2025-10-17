<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\Validator;

class JapaneseValidationTest extends TestCase
{
  /** @test */
  public function バリデーションメッセージが日本語で表示される()
  {
    // 必須項目のテスト
    $validator = Validator::make([], [
      'name' => 'required',
      'email' => 'required|email'
    ]);

    $errors = $validator->errors()->toArray();

    $this->assertEquals('名前は必須です。', $errors['name'][0]);
    $this->assertEquals('メールアドレスは必須です。', $errors['email'][0]);
  }

  /** @test */
  public function 文字数制限のメッセージが日本語で表示される()
  {
    $validator = Validator::make([
      'password' => 'short'
    ], [
      'password' => 'min:8'
    ]);

    $errors = $validator->errors()->toArray();

    $this->assertEquals('パスワードは8文字以上で入力してください。', $errors['password'][0]);
  }

  /** @test */
  public function メール形式のメッセージが日本語で表示される()
  {
    $validator = Validator::make([
      'email' => 'invalid-email'
    ], [
      'email' => 'email'
    ]);

    $errors = $validator->errors()->toArray();

    $this->assertEquals('メールアドレスには有効なメールアドレスを入力してください。', $errors['email'][0]);
  }

  /** @test */
  public function 数値範囲のメッセージが日本語で表示される()
  {
    $validator = Validator::make([
      'age' => 200
    ], [
      'age' => 'numeric|max:150'
    ]);

    $errors = $validator->errors()->toArray();

    $this->assertEquals('年齢は150以下の数値を指定してください。', $errors['age'][0]);
  }

  /** @test */
  public function 確認パスワードのメッセージが日本語で表示される()
  {
    $validator = Validator::make([
      'password' => 'password123',
      'password_confirmation' => 'different'
    ], [
      'password' => 'confirmed'
    ]);

    $errors = $validator->errors()->toArray();

    $this->assertEquals('パスワードと確認用の値が一致しません。', $errors['password'][0]);
  }

  /** @test */
  public function 文字列の種類制限のメッセージが日本語で表示される()
  {
    $validator = Validator::make([
      'username' => '123abc!@#'
    ], [
      'username' => 'alpha_num'
    ]);

    $errors = $validator->errors()->toArray();

    $this->assertEquals('ユーザー名には英数字のみ使用してください。', $errors['username'][0]);
  }
}
