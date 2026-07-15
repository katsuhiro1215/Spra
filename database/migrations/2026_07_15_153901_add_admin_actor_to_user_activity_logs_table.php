<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('user_activity_logs', function (Blueprint $table) {
            $table->string('actor_type')->default('user')->after('user_id')->comment('操作主体（user または admin）');
            $table->uuid('admin_id')->nullable()->after('actor_type')->comment('AdminID（Admin操作の場合）');
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('set null');

            $table->index(['admin_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_activity_logs', function (Blueprint $table) {
            $table->dropForeign(['admin_id']);
            $table->dropIndex(['admin_id', 'created_at']);
            $table->dropColumn(['actor_type', 'admin_id']);
        });
    }
};
