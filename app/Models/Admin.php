<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use App\Models\Concerns\HasLoginLockout;
use App\Models\Concerns\HasTwoFactorAuthentication;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Permission;

class Admin extends Authenticatable
{
    use HasUuid, HasFactory, Notifiable, SoftDeletes, HasRoles, HasLoginLockout, HasTwoFactorAuthentication;

    /**
     * idの型を指定(UUID対応)
     * @var string
     * @var bool
     */
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'email',
        'password',
        'role',
        'status',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at'     => 'datetime',
            'locked_until'      => 'datetime',
            'two_factor_secret' => 'encrypted',
            'two_factor_recovery_codes' => 'encrypted:array',
            'two_factor_confirmed_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    public const ROLES = [
        'owner'       => 'オーナー',
        'super_admin' => 'スーパー管理者',
        'admin'       => '管理者',
        'editor'      => '編集者',
    ];

    /**
     * 個別制限をかけられるロール（owner/super_adminは常にフルアクセスのため対象外）
     */
    public const RESTRICTABLE_ROLES = ['admin', 'editor'];

    public const STATUSES = [
        'active'    => '有効',
        'inactive'  => '無効',
        'suspended' => '停止中',
    ];

    /**
     * role カラムの値を常に Spatie の Role 割当と同期する
     */
    protected static function booted(): void
    {
        static::saved(function (self $admin) {
            if ($admin->wasRecentlyCreated || $admin->wasChanged('role')) {
                $admin->syncRoles([$admin->role]);
            }
        });
    }

    // -------------------------
    // Relationships
    // -------------------------

    /**
     * このAdmin個人に対して追加で剥奪されている権限（ロールが本来許可していても無効化される）
     */
    public function restrictedPermissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'admin_permission_restrictions');
    }

    public function profile(): MorphOne
    {
        return $this->morphOne(Profile::class, 'profilable');
    }

    public function addresses(): MorphMany
    {
        return $this->morphMany(Address::class, 'addressable');
    }

    public function defaultAddress(): MorphOne
    {
        return $this->morphOne(Address::class, 'addressable')
            ->where('is_default', true)
            ->where('is_active', true);
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'author_id');
    }

    public function assignedProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'admin_id');
    }



    public function confirmedPayments(): HasMany
    {
        return $this->hasMany(Payment::class, 'confirmed_by');
    }

    // -------------------------
    // Scopes
    // -------------------------

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    // -------------------------
    // Helpers
    // -------------------------

    public function isOwner(): bool
    {
        return $this->role === 'owner';
    }

    public function isSuperAdmin(): bool
    {
        return in_array($this->role, ['owner', 'super_admin']);
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['super_admin', 'admin']);
    }

    public function getRoleNameAttribute(): string
    {
        return self::ROLES[$this->role] ?? $this->role;
    }

    /**
     * 個別制限の対象になり得るロールか（admin/editorのみ）
     */
    public function isRestrictable(): bool
    {
        return in_array($this->role, self::RESTRICTABLE_ROLES, true);
    }

    /**
     * ロール権限 + 個別制限を踏まえた実効的な権限判定
     */
    public function hasEffectivePermission(string $permission): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        if ($this->restrictedPermissions()->where('name', $permission)->exists()) {
            return false;
        }

        return $this->hasPermissionTo($permission, 'admins');
    }

    /**
     * フロントエンドへ共有する実効的な権限名の一覧
     *
     * @return array<int, string>
     */
    public function getEffectivePermissionNames(): array
    {
        if ($this->isSuperAdmin()) {
            return Permission::where('guard_name', 'admins')->pluck('name')->all();
        }

        $restricted = $this->restrictedPermissions()->pluck('name')->all();

        return $this->getAllPermissions()
            ->pluck('name')
            ->reject(fn(string $name) => in_array($name, $restricted, true))
            ->values()
            ->all();
    }

    public function updateLastLogin(): bool
    {
        return $this->update(['last_login_at' => now()]);
    }

    /**
     * Send the password reset notification.
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new \App\Notifications\AdminResetPassword($token));
    }
}
