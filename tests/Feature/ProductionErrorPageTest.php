<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class ProductionErrorPageTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // 本番環境の例外ハンドラ分岐（app()->environment('local', 'testing')の除外）を検証するため、
        // このテストだけ一時的にproduction環境として扱う
        $this->app->detectEnvironment(fn () => 'production');
        config(['app.debug' => false]);
    }

    public function test_404_renders_dedicated_error_view_with_correct_status(): void
    {
        $response = $this->get('/this-route-does-not-exist');

        $response->assertStatus(404);
        $response->assertSee('404');
        $response->assertSee('お探しのページ');
    }

    public function test_unhandled_exception_renders_500_error_view_instead_of_blank_response(): void
    {
        Route::get('/__test-throws', function () {
            throw new \RuntimeException('boom');
        })->middleware('web');

        $response = $this->get('/__test-throws');

        $response->assertStatus(500);
        $response->assertSee('500');
        $response->assertSee('サーバーエラー');
    }
}
