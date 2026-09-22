<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 提案書テーブル (ULID)
     * ヒアリング内容をもとにした提案書。ヒアリング→見積を直接つなぐ経路と、
     * ヒアリング→提案書→見積を経由する経路の両方をサポートするため、
     * hearing_id・quotes.proposal_id はいずれもnullableとする。
     */
    public function up(): void
    {
        Schema::create('proposals', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('hearing_id')->nullable();
            $table->foreign('hearing_id')->references('id')->on('hearings')->onDelete('set null');

            $table->ulid('contact_id')->nullable();
            $table->foreign('contact_id')->references('id')->on('contacts')->onDelete('set null');

            $table->string('title');
            $table->longText('content')->nullable()->comment('AIまたは管理者が作成した分析・提案文面(Markdown)');
            $table->enum('status', ['draft', 'reviewing', 'sent'])->default('draft');

            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();

            $table->index('hearing_id');
            $table->index(['contact_id', 'created_at']);
        });

        Schema::table('quotes', function (Blueprint $table) {
            $table->ulid('proposal_id')->nullable()->after('contact_id');
            $table->foreign('proposal_id')->references('id')->on('proposals')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->dropForeign(['proposal_id']);
            $table->dropColumn('proposal_id');
        });

        Schema::dropIfExists('proposals');
    }
};
