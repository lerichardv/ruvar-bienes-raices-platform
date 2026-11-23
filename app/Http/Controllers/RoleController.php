<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    /**
     * Get the standardized module definitions.
     *
     * @return list<array{key: string, name: string, description: string}>
     */
    public static function getSystemModules(): array
    {
        return [
            [
                'key' => 'propiedades',
                'name' => 'Propiedades',
                'description' => 'Listados de venta, alquiler, características y precios.',
            ],
            [
                'key' => 'proyectos',
                'name' => 'Proyectos',
                'description' => 'Desarrollos residenciales, master plans y fases de construcción.',
            ],
            [
                'key' => 'articulos',
                'name' => 'Artículos',
                'description' => 'Publicaciones del portal, artículos informativos y noticias del mercado.',
            ],
            [
                'key' => 'usuarios',
                'name' => 'Lista de Usuarios',
                'description' => 'Cuentas de agentes, directores y personal con acceso al sistema.',
            ],
            [
                'key' => 'roles',
                'name' => 'Roles de Usuarios',
                'description' => 'Definición de perfiles, permisos y privilegios de acceso.',
            ],
        ];
    }

    /**
     * Display a listing of roles and their permissions.
     */
    public function index(): Response
    {
        $modules = self::getSystemModules();

        $roles = Role::with('permissions')
            ->withCount('users')
            ->orderBy('id')
            ->get()
            ->map(function (Role $role) use ($modules) {
                $modulePermissions = [];

                foreach ($modules as $module) {
                    $modulePermissions[$module['key']] = $role->getModulePermissionLevel($module['key']);
                }

                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'slug' => $role->slug,
                    'description' => $role->description,
                    'color' => $role->color ?? '#8b5cf6',
                    'users_count' => $role->users_count,
                    'is_system_admin' => in_array($role->slug, ['admin', 'administrador'], true),
                    'module_permissions' => $modulePermissions,
                ];
            });

        return Inertia::render('roles/index', [
            'roles' => $roles,
            'modules' => $modules,
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:roles,slug'],
            'description' => ['nullable', 'string', 'max:500'],
            'color' => ['nullable', 'string', 'max:50'],
            'permissions' => ['required', 'array'],
        ]);

        $slug = ! empty($validated['slug'])
            ? Str::slug($validated['slug'])
            : Str::slug($validated['name']);

        // Ensure unique slug
        $originalSlug = $slug;
        $counter = 1;
        while (Role::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        $role = Role::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'color' => $validated['color'] ?? '#8b5cf6',
        ]);

        $this->syncRolePermissions($role, $validated['permissions']);

        return redirect()->route('roles.index')->with('success', 'Rol creado exitosamente con sus permisos asignados.');
    }

    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, Role $role): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('roles', 'slug')->ignore($role->id)],
            'description' => ['nullable', 'string', 'max:500'],
            'color' => ['nullable', 'string', 'max:50'],
            'permissions' => ['required', 'array'],
        ]);

        $role->name = $validated['name'];

        if (! empty($validated['slug']) && ! in_array($role->slug, ['admin', 'administrador'], true)) {
            $role->slug = Str::slug($validated['slug']);
        }

        $role->description = $validated['description'] ?? null;
        if (! empty($validated['color'])) {
            $role->color = $validated['color'];
        }
        $role->save();

        $this->syncRolePermissions($role, $validated['permissions']);

        return redirect()->route('roles.index')->with('success', 'Rol y permisos actualizados exitosamente.');
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Role $role): RedirectResponse
    {
        if (in_array($role->slug, ['admin', 'administrador'], true)) {
            return redirect()->route('roles.index')->with('error', 'El rol de Administrador principal del sistema no puede ser eliminado.');
        }

        if ($role->users()->count() > 0) {
            return redirect()->route('roles.index')->with('error', 'No se puede eliminar un rol que tiene usuarios asignados. Reasigne los usuarios primero.');
        }

        $role->delete();

        return redirect()->route('roles.index')->with('success', 'Rol eliminado correctamente.');
    }

    /**
     * Synchronize permissions based on module => action selection.
     *
     * @param  array<string, string>  $modulePermissions  Array of module => 'none'|'view'|'manage'
     */
    private function syncRolePermissions(Role $role, array $modulePermissions): void
    {
        $permissionIds = [];

        foreach ($modulePermissions as $moduleKey => $level) {
            if ($level === 'manage') {
                // Manage includes both view and manage
                $perms = Permission::where('module', $moduleKey)
                    ->whereIn('action', ['view', 'manage'])
                    ->pluck('id')
                    ->all();
                $permissionIds = array_merge($permissionIds, $perms);
            } elseif ($level === 'view') {
                $perm = Permission::where('module', $moduleKey)
                    ->where('action', 'view')
                    ->first();
                if ($perm) {
                    $permissionIds[] = $perm->id;
                }
            }
        }

        $role->permissions()->sync(array_unique($permissionIds));
    }
}
