<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Services\AdminService;
use Illuminate\Database\Seeder;

class AiStaffSeeder extends Seeder
{
    /**
     * company/CLAUDE.md記載の部署一覧(秘書室を除く、稼働中の10部署)に
     * 対応するAI社員を作成する。
     */
    public const DEPARTMENTS = [
        'marketing',
        'creative',
        'articles',
        'tech-blog',
        'ai-tools',
        'spra',
        'forge',
        'nara-next',
        'office',
        'katsuooool',
    ];

    public function run(): void
    {
        $service = app(AdminService::class);

        foreach (self::DEPARTMENTS as $department) {
            $alreadyExists = Admin::where('role', 'ai_staff')
                ->where('department', $department)
                ->exists();

            if ($alreadyExists) {
                continue;
            }

            $result = $service->createAiStaff($department);
            $this->command?->info("{$department}: {$result['admin']->email} / {$result['password']}");
        }
    }
}
