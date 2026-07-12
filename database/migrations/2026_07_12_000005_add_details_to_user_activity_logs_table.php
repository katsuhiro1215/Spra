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
            $table->string('method', 10)->nullable()->after('action');
            $table->string('url', 2048)->nullable()->after('method');
            $table->string('route_name')->nullable()->after('url');
            $table->json('request_data')->nullable()->after('new_values');
            $table->json('response_data')->nullable()->after('request_data');
            $table->string('device_type')->nullable()->after('user_agent');
            $table->string('browser')->nullable()->after('device_type');
            $table->string('platform')->nullable()->after('browser');
            $table->string('session_id')->nullable()->after('platform');
            $table->string('status')->default('success')->after('description');
            $table->json('additional_data')->nullable()->after('status');
            $table->timestamp('performed_at')->nullable()->after('additional_data');

            $table->index('status');
            $table->index('performed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_activity_logs', function (Blueprint $table) {
            $table->dropColumn([
                'method',
                'url',
                'route_name',
                'request_data',
                'response_data',
                'device_type',
                'browser',
                'platform',
                'session_id',
                'status',
                'additional_data',
                'performed_at',
            ]);
        });
    }
};
