import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    Check,
    CheckCircle2,
    Eye,
    FolderKanban,
    Home,
    Layers,
    Lock,
    Pencil,
    Plus,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';

interface SystemModule {
    key: string;
    name: string;
    description: string;
}

interface RoleItem {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    users_count: number;
    is_system_admin: boolean;
    module_permissions: Record<string, 'none' | 'view' | 'manage'>;
}

interface Props {
    roles: RoleItem[];
    modules: SystemModule[];
}

export default function RolesIndex({ roles, modules }: Props) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleItem | null>(null);

    const [roleToDelete, setRoleToDelete] = useState<RoleItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Initial permissions map default to 'none'
    const defaultPermissions = modules.reduce(
        (acc, mod) => {
            acc[mod.key] = 'none';
            return acc;
        },
        {} as Record<string, string>,
    );

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        slug: '',
        description: '',
        permissions: defaultPermissions,
    });

    const openCreateSheet = () => {
        clearErrors();
        reset();
        setData({
            name: '',
            slug: '',
            description: '',
            permissions: { ...defaultPermissions },
        });
        setEditingRole(null);
        setIsSheetOpen(true);
    };

    const openEditSheet = (role: RoleItem) => {
        clearErrors();
        setData({
            name: role.name,
            slug: role.slug,
            description: role.description || '',
            permissions: { ...role.module_permissions },
        });
        setEditingRole(role);
        setIsSheetOpen(true);
    };

    const handlePermissionChange = (moduleKey: string, level: 'none' | 'view' | 'manage') => {
        setData('permissions', {
            ...data.permissions,
            [moduleKey]: level,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingRole) {
            put(`/roles/${editingRole.id}`, {
                onSuccess: () => {
                    setIsSheetOpen(false);
                    reset();
                },
            });
        } else {
            post('/roles', {
                onSuccess: () => {
                    setIsSheetOpen(false);
                    reset();
                },
            });
        }
    };

    const confirmDelete = () => {
        if (!roleToDelete) return;

        if (roleToDelete.is_system_admin) {
            alert('El rol de Administrador principal no puede ser eliminado.');
            setRoleToDelete(null);
            return;
        }

        if (roleToDelete.users_count > 0) {
            alert('No se puede eliminar un rol con usuarios asignados.');
            setRoleToDelete(null);
            return;
        }

        setIsDeleting(true);
        router.delete(`/roles/${roleToDelete.id}`, {
            onFinish: () => {
                setIsDeleting(false);
                setRoleToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Roles y Permisos - Ruvar Bienes Raíces" />

            <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#f8fafc] dark:bg-[#080d16]">
                {/* Header section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-[#0b1a30] dark:text-white uppercase">
                            ROLES Y PERMISOS DEL SISTEMA
                        </h1>
                        <p className="mt-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            CONFIGURA LOS PRIVILEGIOS POR MÓDULO (VER O VER Y GESTIONAR) PARA CADA PERFIL
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={openCreateSheet}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b1a30] px-5 py-2.5 text-xs font-bold tracking-wide text-white shadow-xs transition-all hover:bg-[#15233c] hover:shadow"
                    >
                        <Plus className="size-4 stroke-[2.5]" />
                        <span>+ Nuevo Rol</span>
                    </Button>
                </div>

                {/* Roles Cards Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[#0d1627]"
                        >
                            <div className="space-y-4">
                                {/* Role Header */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-11 items-center justify-center rounded-xl bg-slate-100 text-[#0b1a30] dark:bg-slate-800 dark:text-white">
                                            <ShieldCheck className="size-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                                    {role.name}
                                                </h2>
                                                {role.is_system_admin && (
                                                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                                                        Sistema
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs font-mono text-slate-400">
                                                slug: {role.slug}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1 text-slate-400">
                                        <button
                                            type="button"
                                            onClick={() => openEditSheet(role)}
                                            className="rounded-lg p-1.5 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                            title="Editar rol y permisos"
                                        >
                                            <Pencil className="size-4" />
                                        </button>

                                        {role.is_system_admin || role.users_count > 0 ? (
                                            <button
                                                type="button"
                                                disabled
                                                className="cursor-not-allowed rounded-lg p-1.5 text-slate-300 opacity-40 dark:text-slate-600"
                                                title={
                                                    role.is_system_admin
                                                        ? 'El rol del sistema no se puede eliminar'
                                                        : 'Tiene usuarios asignados'
                                                }
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setRoleToDelete(role)}
                                                className="rounded-lg p-1.5 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                                                title="Eliminar rol"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-300">
                                    {role.description || 'Sin descripción asignada.'}
                                </p>

                                {/* Module Permissions Breakdown */}
                                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Permisos por Módulo:
                                    </span>

                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        {modules.map((mod) => {
                                            const level = role.module_permissions[mod.key] || 'none';

                                            return (
                                                <div
                                                    key={mod.key}
                                                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs dark:bg-slate-800/50"
                                                >
                                                    <span className="font-medium text-slate-700 dark:text-slate-200">
                                                        {mod.name}
                                                    </span>

                                                    {level === 'manage' ? (
                                                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                                                            <Check className="size-3" />
                                                            <span>Ver y Gestionar</span>
                                                        </span>
                                                    ) : level === 'view' ? (
                                                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                                                            <Eye className="size-3" />
                                                            <span>Ver</span>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-200/70 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                                                            <span>Sin Acceso</span>
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer: Users Count */}
                            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 dark:border-white/5 dark:text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <Users className="size-3.5 text-slate-400" />
                                    <span>
                                        <strong>{role.users_count}</strong> {role.users_count === 1 ? 'usuario asignado' : 'usuarios asignados'}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => openEditSheet(role)}
                                    className="font-semibold text-[#0b1a30] hover:underline dark:text-slate-200"
                                >
                                    Modificar permisos →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* shadcn Sheet para Crear / Configurar Rol y Permisos */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right" className="w-full sm:max-w-lg p-6 bg-white dark:bg-[#0d1627] flex flex-col justify-between overflow-y-auto">
                    <div>
                        <SheetHeader className="text-left pb-4 border-b border-slate-100 dark:border-white/10">
                            <SheetTitle className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {editingRole ? `Configurar: ${editingRole.name}` : 'Crear Nuevo Rol'}
                            </SheetTitle>
                            <SheetDescription className="text-xs text-slate-500 dark:text-slate-400">
                                Define el nombre del rol y establece el nivel de privilegios (Sin acceso, Ver, o Ver y Gestionar) para cada módulo.
                            </SheetDescription>
                        </SheetHeader>

                        <form id="role-form" onSubmit={handleSubmit} className="space-y-5 pt-6">
                            {/* Nombre del Rol */}
                            <div className="space-y-1.5">
                                <Label htmlFor="role-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Nombre del Rol *
                                </Label>
                                <Input
                                    id="role-name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ej. Coordinador de Operaciones"
                                    required
                                    className="rounded-xl border-slate-200 text-xs py-2 dark:border-slate-700"
                                />
                                {errors.name && (
                                    <p className="text-[11px] text-rose-600">{errors.name}</p>
                                )}
                            </div>

                            {/* Descripción */}
                            <div className="space-y-1.5">
                                <Label htmlFor="role-desc" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Descripción del Perfil
                                </Label>
                                <textarea
                                    id="role-desc"
                                    rows={2}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Alcance de las funciones y responsabilidades del rol..."
                                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                />
                                {errors.description && (
                                    <p className="text-[11px] text-rose-600">{errors.description}</p>
                                )}
                            </div>

                            {/* Matriz de Permisos por Módulo */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                        Permisos por Módulo
                                    </Label>
                                    <span className="text-[10px] text-slate-500">
                                        Selecciona el alcance por sección
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {modules.map((mod) => {
                                        const currentLevel = data.permissions[mod.key] || 'none';

                                        return (
                                            <div
                                                key={mod.key}
                                                className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 space-y-2 dark:border-white/10 dark:bg-slate-800/40"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                                                        {mod.name}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-slate-400">
                                                        {mod.key}
                                                    </span>
                                                </div>

                                                <p className="text-[11px] text-slate-500 leading-tight dark:text-slate-400">
                                                    {mod.description}
                                                </p>

                                                {/* Selector 3 niveles: Sin Acceso | Ver | Ver y Gestionar */}
                                                <div className="grid grid-cols-3 gap-1.5 pt-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePermissionChange(mod.key, 'none')}
                                                        className={`rounded-lg py-1.5 text-center text-xs font-semibold transition-all ${
                                                            currentLevel === 'none'
                                                                ? 'bg-slate-300 text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                                                                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                                                        }`}
                                                    >
                                                        Sin Acceso
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handlePermissionChange(mod.key, 'view')}
                                                        className={`rounded-lg py-1.5 text-center text-xs font-semibold transition-all ${
                                                            currentLevel === 'view'
                                                                ? 'bg-blue-600 text-white shadow-xs'
                                                                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                                                        }`}
                                                    >
                                                        Ver
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handlePermissionChange(mod.key, 'manage')}
                                                        className={`rounded-lg py-1.5 text-center text-xs font-semibold transition-all ${
                                                            currentLevel === 'manage'
                                                                ? 'bg-emerald-600 text-white shadow-xs'
                                                                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                                                        }`}
                                                    >
                                                        Ver y Gestionar
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </form>
                    </div>

                    <SheetFooter className="border-t border-slate-100 pt-4 dark:border-white/10 flex flex-row gap-2 justify-end mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsSheetOpen(false)}
                            className="rounded-xl text-xs py-2 border-slate-200"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            form="role-form"
                            disabled={processing}
                            className="rounded-xl bg-[#0b1a30] text-xs font-bold text-white hover:bg-[#15233c] py-2 px-5"
                        >
                            {processing && <Spinner className="mr-2" />}
                            {editingRole ? 'Actualizar Rol' : 'Guardar Rol'}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Prompt de Confirmación para Eliminar Rol */}
            <Dialog open={!!roleToDelete} onOpenChange={(open) => !open && setRoleToDelete(null)}>
                <DialogContent className="sm:max-w-md rounded-2xl bg-white p-6 dark:bg-[#0d1627]">
                    <DialogHeader className="text-left space-y-2">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                            <AlertTriangle className="size-5" />
                        </div>
                        <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                            ¿Eliminar rol del sistema?
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                            Estás a punto de eliminar el rol{' '}
                            <strong className="text-slate-800 dark:text-slate-200">{roleToDelete?.name}</strong>. Esta
                            acción revocará las asignaciones de permisos de este perfil y no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="mt-4 flex flex-row gap-2 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setRoleToDelete(null)}
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
                            Eliminar Rol
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

RolesIndex.layout = {
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
            title: 'ROLES DE USUARIOS',
            href: '/roles',
        },
    ],
};
