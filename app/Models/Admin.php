<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Admin extends Authenticatable
{
    use HasUuid, HasFactory, Notifiable, SoftDeletes;

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
            'password'          => 'hashed',
        ];
    }

    public const ROLES = [
        'super_admin' => 'スーパー管理者',
        'admin'       => '管理者',
        'editor'      => '編集者',
    ];

    public const STATUSES = [
        'active'    => '有効',
        'inactive'  => '無効',
        'suspended' => '停止中',
    ];

    // -------------------------
    // Relationships
    // -------------------------

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



    public function acknowledgedPaymentNotifications(): HasMany
    {
        return $this->hasMany(PaymentNotification::class, 'acknowledged_by');
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
