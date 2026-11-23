<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleAndPermissionSeeder::class);
    }

    public function test_users_screen_can_be_rendered(): void
    {
        $admin = User::where('email', 'ricardo.valladares.triminio@gmail.com')->first();

        $response = $this->actingAs($admin)->get(route('users.index'));

        $response->assertOk();
    }

    public function test_user_can_be_created(): void
    {
        $admin = User::where('email', 'ricardo.valladares.triminio@gmail.com')->first();
        $agenteRole = Role::where('slug', 'agente')->first();

        $response = $this->actingAs($admin)->post(route('users.store'), [
            'name' => 'Nuevo Agente',
            'email' => 'nuevo.agente@ruvar.com',
            'password' => 'secret1234',
            'password_confirmation' => 'secret1234',
            'role_id' => $agenteRole->id,
        ]);

        $response->assertRedirect(route('users.index'));
        $this->assertDatabaseHas('users', [
            'email' => 'nuevo.agente@ruvar.com',
            'role_id' => $agenteRole->id,
        ]);
    }

    public function test_user_creation_fails_when_password_confirmation_does_not_match(): void
    {
        $admin = User::where('email', 'ricardo.valladares.triminio@gmail.com')->first();
        $agenteRole = Role::where('slug', 'agente')->first();

        $response = $this->actingAs($admin)->post(route('users.store'), [
            'name' => 'Agente Invalido',
            'email' => 'invalido@ruvar.com',
            'password' => 'secret1234',
            'password_confirmation' => 'diferente999',
            'role_id' => $agenteRole->id,
        ]);

        $response->assertSessionHasErrors(['password']);
        $this->assertDatabaseMissing('users', [
            'email' => 'invalido@ruvar.com',
        ]);
    }

    public function test_user_can_be_updated(): void
    {
        $admin = User::where('email', 'ricardo.valladares.triminio@gmail.com')->first();
        $targetUser = User::where('email', 'carlos.ramirez@ruvar.com')->first();
        $editorRole = Role::where('slug', 'editor')->first();

        $response = $this->actingAs($admin)->put(route('users.update', $targetUser), [
            'name' => 'Carlos Ramírez Modificado',
            'email' => 'carlos.ramirez@ruvar.com',
            'role_id' => $editorRole->id,
        ]);

        $response->assertRedirect(route('users.index'));
        $this->assertDatabaseHas('users', [
            'id' => $targetUser->id,
            'name' => 'Carlos Ramírez Modificado',
            'role_id' => $editorRole->id,
        ]);
    }

    public function test_user_password_can_be_updated_with_confirmation(): void
    {
        $admin = User::where('email', 'ricardo.valladares.triminio@gmail.com')->first();
        $targetUser = User::where('email', 'carlos.ramirez@ruvar.com')->first();
        $agenteRole = Role::where('slug', 'agente')->first();

        $response = $this->actingAs($admin)->put(route('users.update', $targetUser), [
            'name' => $targetUser->name,
            'email' => $targetUser->email,
            'role_id' => $agenteRole->id,
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertRedirect(route('users.index'));
        $targetUser->refresh();
        $this->assertTrue(Hash::check('newpassword123', $targetUser->password));
    }

    public function test_authenticated_user_cannot_delete_themselves(): void
    {
        $admin = User::where('email', 'ricardo.valladares.triminio@gmail.com')->first();

        // Attempting to delete oneself
        $response = $this->actingAs($admin)->delete(route('users.destroy', $admin));

        $response->assertRedirect(route('users.index'));
        $response->assertSessionHas('error', 'No puedes eliminar tu propia cuenta de usuario.');
        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    public function test_user_can_be_deleted_by_admin(): void
    {
        $admin = User::where('email', 'ricardo.valladares.triminio@gmail.com')->first();
        $targetUser = User::where('email', 'carlos.ramirez@ruvar.com')->first();

        $response = $this->actingAs($admin)->delete(route('users.destroy', $targetUser));

        $response->assertRedirect(route('users.index'));
        $this->assertDatabaseMissing('users', ['id' => $targetUser->id]);
    }
}
