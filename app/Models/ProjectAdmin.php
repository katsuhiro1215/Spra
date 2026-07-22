<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProjectAdmin extends Pivot
{
    use HasUlid;

    protected $table = 'project_admin';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = true;

    public const ROLES = [
        'leader' => 'リーダー',
        'designer' => 'デザイン担当',
        'developer' => '開発担当',
        'manager' => 'マネージャー',
        'other' => 'その他',
    ];

    protected $fillable = [
        'role',
    ];
}
