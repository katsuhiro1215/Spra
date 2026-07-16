<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

/**
 * 支払い確認フローの一本化
 *
 * これまで「Userからの入金報告」は payment_notifications テーブルに記録され、
 * Adminが確認した時点で初めて payments テーブルに正式なレコードが作られていた。
 * このため payment_notifications はAdmin側のどの画面からも参照されず、
 * Userが入金報告をしてもAdminが気づく手段がない状態になっていた。
 *
 * payments.status には元々 pending/completed/failed/refunded が定義されており
 * (PaymentService::confirm() も存在した)、本来は「Userの入金報告 = status:pending の
 * Payment」「Adminの確認 = 同じレコードを status:completed に更新」という設計だった
 * とみられる。この移行では既存データを引き継いだ上でその設計に一本化する。
 */
return new class extends Migration
{
    public function up(): void
    {
        // 既存の payment_notifications を payments へ移行する
        // (acknowledged/verified は completed、rejected は failed、pending はそのまま)
        $statusMap = [
            'pending' => 'pending',
            'acknowledged' => 'completed',
            'verified' => 'completed',
            'rejected' => 'failed',
        ];

        $notifications = DB::table('payment_notifications')->get();

        foreach ($notifications as $notification) {
            // 既にAdminが確認しPaymentが作られている場合、Payment側に情報が
            // 既に存在するため移行の必要はない
            if ($notification->payment_id) {
                continue;
            }

            DB::table('payments')->insert([
                'id' => (string) Str::ulid(),
                'invoice_id' => $notification->invoice_id,
                'company_id' => $notification->company_id,
                'amount' => $notification->amount,
                'payment_method' => $notification->payment_method,
                'payment_date' => $notification->payment_date,
                'transaction_id' => $notification->transaction_id,
                'status' => $statusMap[$notification->status] ?? 'pending',
                'notes' => $notification->notes,
                'confirmed_by' => $notification->acknowledged_by,
                'confirmed_at' => $notification->acknowledged_at,
                'created_at' => $notification->created_at,
                'updated_at' => $notification->updated_at,
            ]);
        }

        Schema::dropIfExists('payment_notifications');
    }

    /**
     * ロールバック時はテーブル構造のみ復元する（移行後に生まれた payments 側の
     * 変更をどの行が payment_notifications 由来か区別できないため、データは復元しない）
     */
    public function down(): void
    {
        Schema::create('payment_notifications', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('invoice_id');
            $table->foreign('invoice_id')->references('id')->on('invoices')->onDelete('cascade');
            $table->ulid('payment_id')->nullable();
            $table->foreign('payment_id')->references('id')->on('payments')->onDelete('set null');
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->ulid('company_id')->nullable();
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('set null');

            $table->enum('payment_method', ['bank_transfer', 'credit_card', 'cash', 'other']);
            $table->decimal('amount', 12, 2);
            $table->date('payment_date');
            $table->string('transaction_id')->nullable();
            $table->text('notes')->nullable();

            $table->enum('status', ['pending', 'acknowledged', 'verified', 'rejected'])->default('pending');
            $table->timestamp('acknowledged_at')->nullable();
            $table->uuid('acknowledged_by')->nullable();
            $table->foreign('acknowledged_by')->references('id')->on('admins')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['invoice_id', 'status']);
            $table->index(['user_id', 'status']);
            $table->index('payment_date');
            $table->index('created_at');
        });
    }
};
