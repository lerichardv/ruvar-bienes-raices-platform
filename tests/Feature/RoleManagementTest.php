<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleAndPermissionSeeder::class);
    }

    public function test_roles_screen_can_be_rendered(): void
    {
        $admin = User::where('email', 'ricardo.valladares.triminio@gmail.com')->first();

        $response = $this->actingAs($admin)->get(route('roles.index'));

        $response->assertOk();
    }

    public function test_role_can_be_created_with_module_permissions(): void
    {
        $admin = User::where('email', 'ricardo.valladares.triminio@gmail.com')->first();

        $response = $this->actingAs($admin)->post(route('roles.store'), [
            'name' => 'Coordinador de Alquileres',
            'description' => 'Gestiona propiedades y visualiza proyectos',
            'permissions' => [
                'propiedades' => 'manage',
                'proyectos' => 'view',
                'articulos' => 'none',
                'usuarios' => 'none',
                'roles' => 'none',
            ],
        ]);

        $response->assertRedirect(route('roles.index'));

        $role = Role::where('slug', 'coordinador-de-alquileres')->first();
        $this->assertNotNull($role);
        $this->assertSame('Coordinador de Alquileres', $role->name);

        // Check assigned permissions: manage gives both view and manage for propiedades
        $this->assertTrue($role->hasPermission('propiedades', 'view'));
        $this->assertTrue($role->hasPermission('propiedades', 'manage'));
        $this->assertTrue($role->hasPermission('proyectos', 'view'));
        $this->assertFalse($role->hasPermission('proyectos', 'manage'));
        $this->assertFalse($role->hasPermission('articulos', 'view'));
    }

    public function test_role_can_be_updated_with_new_permissions(): void
    {
        $admin = User::where('email', 'ricardo.valladares.triminio@gmail.com')->first();
        $role = Role::create([
            'name' => 'Auditor Temporal',
            'slug' => 'auditor-temporal',
            'description' => 'Solo lectura inicial',
        ]);

        $response = $this->actingAs($admin)->put(route('roles.update', $role), [
            'name' => 'Auditor Senior',
            'slug' => 'auditor-senior',
            'description' => 'Lectura de artículos y gestión de propiedades',
            'permissions' => [
                'propiedades' => 'manage',
                'proyectos' => 'none',
                'articulos' => 'view',
                'usuarios' => 'none',
                'roles' => 'none',
            ],
        ]);

        $response->assertRedirect(route('roles.index'));

        $role->refresh();
        $this->assertSame('Auditor Senior', $role->name);
        $this->assertSame('auditor-senior', $role->slug);
        $this->assertTrue($role->hasPermission('propiedades', 'manage'));
        $this->assertTrue($role->hasPermission('articulos', 'view'));
        $this->assertFalse($role->hasPermission('articulos', 'manage'));
    }

    public function test_system_admin_role_cannot_be_deleted(): void
    {
        $admin = User::where('email', 'ricardo.valladares.triminio@gmail.com')->first();
        $adminRole = Role::where('slug', 'admin')->first();

        $response = $this->actingAs($admin)->delete(route('roles.destroy', $adminRole));

        $response->assertRedirect(route('roles.index'));
        $response->assertSessionHas('error', 'El rol de Administrador principal del sistema no puede ser eliminado.');
        $this->assertDatabaseHas('roles', ['id' => $adminRole->id]);
    }

    public function test_role_with_assigned_users_cannot_be_deleted(): void
    {
        $admin = User::where('email', 'ricardo.valladares.triminio@gmail.com')->first();
        $agenteRole = Role::where('slug', 'agente')->first();

        // Agente has users assigned in the seeder
        $this->assertGreaterThan(0, $agenteRole->users()->count());

        $response = $this->actingAs($admin)->delete(route('roles.destroy', $agenteRole));

        $response->assertRedirect(route('roles.index'));
        $response->assertSessionHas('error', 'No se puede eliminar un rol que tiene usuarios asignados. Reasigne los usuarios primero.');
        $this->assertDatabaseHas('roles', ['id' => $agenteRole->id]);
    }

    public function test_empty_role_can_be_deleted(): void
    {
        $admin = User::where('email', 'ricardo.valladares.triminio@gmail.com')->first();
        $emptyRole = Role::create([
            'name' => 'Rol Temporal',
            'slug' => 'rol-temporal',
            'description' => 'Rol de prueba sin usuarios',
        ]);

        $response = $this->actingAs($admin)->delete(route('roles.destroy', $emptyRole));

        $response->assertRedirect(route('roles.index'));
        $response->assertSessionHas('success', 'Rol eliminado correctamente.');
        $this->assertDatabaseMissing('roles', ['id' => $emptyRole->id]);
    }
}
