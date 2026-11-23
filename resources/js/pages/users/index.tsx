import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Pencil,
    Search,
    Shield,
    Trash2,
    UserPlus,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { RoleBadge } from '@/components/role-badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';
import type { RoleOption, UserItem } from './types';
import { UserSheet } from './user-sheet';

interface Props {
    users: UserItem[];
    roles: RoleOption[];
    filters: {
        search: string;
        role: string;
    };
    currentUserId: number;
}

export default function UsersIndex({ users, roles, filters, currentUserId }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || 'all');

    // Sheet state for create / edit
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);

    // Delete dialog prompt state
    const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openCreateSheet = () => {
        setEditingUser(null);
        setIsSheetOpen(true);
    };

    const openEditSheet = (user: UserItem) => {
        setEditingUser(user);
        setIsSheetOpen(true);
    };

    const confirmDelete = () => {
        if (!userToDelete) return;

        // Extra client-side guard
        if (userToDelete.id === currentUserId || userToDelete.is_current_user) {
            alert('No puedes eliminar tu propia cuenta de usuario.');
            setUserToDelete(null);
            return;
        }

        setIsDeleting(true);
        router.delete(`/usuarios/${userToDelete.id}`, {
            onFinish: () => {
                setIsDeleting(false);
                setUserToDelete(null);
            },
        });
    };

    // Filter users on client side as well for instant search responsiveness
    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const matchesQuery =
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.role_name.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesRole =
                selectedRole === 'all' ||
                String(u.role_id) === selectedRole;

            return matchesQuery && matchesRole;
        });
    }, [users, searchQuery, selectedRole]);

    return (
        <>
            <Head title="Lista de Usuarios - Ruvar Bienes Raíces" />

            <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#f8fafc] dark:bg-[#080d16]">
                {/* Header section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-[#0b1a30] dark:text-white uppercase">
                            USUARIOS DEL SISTEMA
                        </h1>
                        <p className="mt-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            GESTIONA LAS CUENTAS DE ACCESO, ASIGNACIÓN DE ROLES Y PRIVILEGIOS DE AGENTES
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={openCreateSheet}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b1a30] px-5 py-2.5 text-xs font-bold tracking-wide text-white shadow-xs transition-all hover:bg-[#15233c] hover:shadow cursor-pointer"
                    >
                        <UserPlus className="size-4 stroke-[2.5]" />
                        <span>+ Nuevo Usuario</span>
                    </Button>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-[#0d1627]">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar usuario por nombre o correo..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 transition-colors focus:border-slate-400 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            ROL:
                        </span>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                            <option value="all">Todos los Roles</option>
                            {roles.map((role) => (
                                <option key={role.id} value={String(role.id)}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-white/10 dark:bg-[#0d1627]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200/80 bg-slate-50/60 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-white/10 dark:bg-slate-900/40">
                                    <th className="py-4 pl-6 pr-4">USUARIO</th>
                                    <th className="px-4 py-4">ROL ASIGNADO</th>
                                    <th className="px-4 py-4">FECHA REGISTRO</th>
                                    <th className="px-4 py-4">ESTADO</th>
                                    <th className="py-4 pl-4 pr-6 text-right">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm dark:divide-white/5">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400">
                                            No se encontraron usuarios coincidentes.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((u) => {
                                        const initials = u.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .toUpperCase()
                                            .slice(0, 2);

                                        return (
                                            <tr
                                                key={u.id}
                                                className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                                            >
                                                {/* Usuario info */}
                                                <td className="py-4 pl-6 pr-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0b1a30] text-xs font-bold text-white shadow-xs">
                                                            {initials}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-slate-900 dark:text-white">
                                                                    {u.name}
                                                                </span>
                                                                {u.is_current_user && (
                                                                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                                                        Tú
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                                {u.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Rol badge */}
                                                <td className="px-4 py-4">
                                                    <RoleBadge
                                                        name={u.role_name}
                                                        color={u.role_color}
                                                    />
                                                </td>

                                                {/* Fecha */}
                                                <td className="px-4 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                                                    {u.created_at}
                                                </td>

                                                {/* Estado */}
                                                <td className="px-4 py-4">
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                        <span className="size-1.5 rounded-full bg-emerald-500" />
                                                        <span>Activo</span>
                                                    </span>
                                                </td>

                                                {/* Acciones */}
                                                <td className="py-4 pl-4 pr-6 text-right">
                                                    <div className="flex items-center justify-end gap-1 text-slate-400">
                                                        {/* Editar (Abre Sheet) */}
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditSheet(u)}
                                                            className="rounded-lg p-1.5 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
                                                            title="Editar usuario"
                                                        >
                                                            <Pencil className="size-4" />
                                                        </button>

                                                        {/* Eliminar (Prompt) - Deshabilitado si es el usuario logueado */}
                                                        {u.is_current_user ? (
                                                            <button
                                                                type="button"
                                                                disabled
                                                                className="cursor-not-allowed rounded-lg p-1.5 text-slate-300 opacity-40 dark:text-slate-600"
                                                                title="No puedes eliminar tu propio usuario"
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => setUserToDelete(u)}
                                                                className="rounded-lg p-1.5 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 cursor-pointer"
                                                                title="Eliminar usuario"
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Separated and wider Sheet Component for Create / Edit */}
            <UserSheet
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                user={editingUser}
                roles={roles}
            />

            {/* Prompt de Confirmación para Eliminar Usuario */}
            <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <DialogContent className="sm:max-w-md rounded-2xl bg-white p-6 dark:bg-[#0d1627]">
                    <DialogHeader className="text-left space-y-2">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                            <AlertTriangle className="size-5" />
                        </div>
                        <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                            ¿Eliminar usuario del sistema?
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                            Estás a punto de eliminar la cuenta de{' '}
                            <strong className="text-slate-800 dark:text-slate-200">{userToDelete?.name}</strong> (
                            {userToDelete?.email}). Esta acción revocará todos sus accesos y no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="mt-4 flex flex-row gap-2 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setUserToDelete(null)}
                            disabled={isDeleting}
                            className="rounded-xl text-xs border-slate-200"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 py-2 px-4"
                        >
                            {isDeleting && <Spinner className="mr-2" />}
                            Eliminar Usuario
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Escritorio',
            href: dashboard(),
        },
        {
            title: 'USUARIOS',
            href: '/usuarios',
        },
        {
            title: 'LISTA DE USUARIOS',
            href: '/usuarios',
        },
    ],
};
