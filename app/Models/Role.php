<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
    ];

    /**
     * Get the users assigned to this role.
     *
     * @return HasMany<User, $this>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the permissions associated with this role.
     *
     * @return BelongsToMany<Permission, $this>
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_permission')->withTimestamps();
    }

    /**
     * Determine if the role has a given module permission.
     */
    public function hasPermission(string $module, string $action = 'view'): bool
    {
        // If action is view, having 'manage' also grants view
        $targetActions = $action === 'view' ? ['view', 'manage'] : [$action];

        return $this->permissions
            ->where('module', $module)
            ->whereIn('action', $targetActions)
            ->isNotEmpty();
    }

    /**
     * Get the permission level for a module: 'none', 'view', or 'manage'.
     */
    public function getModulePermissionLevel(string $module): string
    {
        $perms = $this->permissions->where('module', $module);

        if ($perms->where('action', 'manage')->isNotEmpty()) {
            return 'manage';
        }

        if ($perms->where('action', 'view')->isNotEmpty()) {
            return 'view';
        }

        return 'none';
    }
}
