<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modules = [
            'propiedades' => 'Propiedades',
            'proyectos' => 'Proyectos',
            'articulos' => 'Artículos',
            'usuarios' => 'Lista de Usuarios',
            'roles' => 'Roles de Usuarios',
        ];

        $actions = [
            'view' => 'Ver',
            'manage' => 'Ver y Gestionar',
        ];

        // 1. Create all permissions
        $permissions = [];
        foreach ($modules as $moduleKey => $moduleLabel) {
            foreach ($actions as $actionKey => $actionLabel) {
                $permissions["{$moduleKey}.{$actionKey}"] = Permission::firstOrCreate(
                    [
                        'module' => $moduleKey,
                        'action' => $actionKey,
                    ],
                    [
                        'name' => "{$actionLabel} {$moduleLabel}",
                        'description' => "Permite {$actionLabel} en el módulo de {$moduleLabel}.",
                    ]
                );
            }
        }

        // 2. Create Roles
        $adminRole = Role::firstOrCreate(
            ['slug' => 'admin'],
            [
                'name' => 'Administrador',
                'description' => 'Acceso total y administración integral de todos los módulos del sistema inmobiliario.',
                'color' => '#8b5cf6',
            ]
        );
        if (empty($adminRole->color) || $adminRole->color === '#7c3aed') {
            $adminRole->update(['color' => '#8b5cf6']);
        }

        $agenteRole = Role::firstOrCreate(
            ['slug' => 'agente'],
            [
                'name' => 'Agente Inmobiliario',
                'description' => 'Gestión completa de cartera de propiedades y proyectos. Visualización de artículos.',
                'color' => '#2563eb',
            ]
        );
        if (empty($agenteRole->color) || $agenteRole->color === '#7c3aed') {
            $agenteRole->update(['color' => '#2563eb']);
        }

        $editorRole = Role::firstOrCreate(
            ['slug' => 'editor'],
            [
                'name' => 'Editor de Contenidos',
                'description' => 'Redacción y gestión de artículos y novedades del portal. Visualización de propiedades.',
                'color' => '#d97706',
            ]
        );
        if (empty($editorRole->color) || $editorRole->color === '#7c3aed') {
            $editorRole->update(['color' => '#d97706']);
        }

        $asesorRole = Role::firstOrCreate(
            ['slug' => 'asesor'],
            [
                'name' => 'Asesor de Ventas',
                'description' => 'Consulta y visualización del catálogo de propiedades y proyectos para atención a clientes.',
                'color' => '#475569',
            ]
        );
        if (empty($asesorRole->color) || $asesorRole->color === '#7c3aed') {
            $asesorRole->update(['color' => '#475569']);
        }

        // 3. Assign permissions to roles
        // Admin gets all permissions
        $adminRole->permissions()->sync(collect($permissions)->pluck('id'));

        // Agente gets manage properties, manage projects, view articles
        $agenteRole->permissions()->sync([
            $permissions['propiedades.view']->id,
            $permissions['propiedades.manage']->id,
            $permissions['proyectos.view']->id,
            $permissions['proyectos.manage']->id,
            $permissions['articulos.view']->id,
        ]);

        // Editor gets manage articles, view properties, view projects
        $editorRole->permissions()->sync([
            $permissions['articulos.view']->id,
            $permissions['articulos.manage']->id,
            $permissions['propiedades.view']->id,
            $permissions['proyectos.view']->id,
        ]);

        // Asesor gets view properties, view projects, view articles
        $asesorRole->permissions()->sync([
            $permissions['propiedades.view']->id,
            $permissions['proyectos.view']->id,
            $permissions['articulos.view']->id,
        ]);

        // 4. Update or create the primary user to have Admin role
        $ricardo = User::firstOrCreate(
            ['email' => 'ricardo.valladares.triminio@gmail.com'],
            [
                'name' => 'Ricardo Valladares',
                'password' => Hash::make('12345678'),
                'email_verified_at' => now(),
                'role_id' => $adminRole->id,
            ]
        );
        if ($ricardo->role_id !== $adminRole->id) {
            $ricardo->role_id = $adminRole->id;
            $ricardo->save();
        }

        // 5. Seed additional users with different roles for demonstration
        $additionalUsers = [
            [
                'name' => 'Carlos Ramírez',
                'email' => 'carlos.ramirez@ruvar.com',
                'role_id' => $agenteRole->id,
            ],
            [
                'name' => 'Sofía Martínez',
                'email' => 'sofia.martinez@ruvar.com',
                'role_id' => $asesorRole->id,
            ],
            [
                'name' => 'Javier Herrera',
                'email' => 'javier.herrera@ruvar.com',
                'role_id' => $editorRole->id,
            ],
            [
                'name' => 'Elena Gómez',
                'email' => 'elena.gomez@ruvar.com',
                'role_id' => $agenteRole->id,
            ],
        ];

        foreach ($additionalUsers as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make('12345678'),
                    'email_verified_at' => now(),
                    'role_id' => $userData['role_id'],
                ]
            );
        }
    }
}
