import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Building2,
    Check,
    CheckCircle2,
    ChevronDown,
    Eye,
    FileText,
    FolderKanban,
    Info,
    Layers,
    Lock,
    Pencil,
    Plus,
    Save,
    Search,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Trash2,
    Users,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { dashboard } from '@/routes';
import { RoleSheet, type RoleItem, type SystemModule } from './role-sheet';

interface Props {
    roles: RoleItem[];
    modules: SystemModule[];
}

export default function RolesIndex({ roles, modules }: Props) {
    // Active selected role
    const [selectedRoleId, setSelectedRoleId] = useState<number>(roles[0]?.id || 1);

    // Search query for filtering permissions/modules
    const [searchQuery, setSearchQuery] = useState('');

    // Role Sheet state (create / edit metadata)
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleItem | null>(null);

    // Delete dialog prompt
    const [roleToDelete, setRoleToDelete] = useState<RoleItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Saving permissions state
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

    // Find current active role
    const currentRole = useMemo(() => {
        return roles.find((r) => r.id === selectedRoleId) || roles[0];
    }, [roles, selectedRoleId]);

    // Local mutable state for the current role's permissions
    const [permissionsState, setPermissionsState] = useState<
        Record<string, 'none' | 'view' | 'manage'>
    >({});

    // Reset local permissions when currentRole changes
    useEffect(() => {
        if (currentRole) {
            setPermissionsState({ ...currentRole.module_permissions });
            setSaveSuccessMessage(null);
        }
    }, [currentRole]);

    // Check if there are unsaved permission changes
    const hasUnsavedChanges = useMemo(() => {
        if (!currentRole) return false;
        return Object.keys(currentRole.module_permissions).some(
            (key) => (permissionsState[key] || 'none') !== (currentRole.module_permissions[key] || 'none'),
        );
    }, [currentRole, permissionsState]);

    // Handle toggling the "Ver" switch
    const handleToggleView = (moduleKey: string, checked: boolean) => {
        if (currentRole.is_system_admin) return;

        setPermissionsState((prev) => {
            const currentLevel = prev[moduleKey] || 'none';
            let nextLevel: 'none' | 'view' | 'manage';

            if (checked) {
                // If checking view, keep manage if it was already manage, else view
                nextLevel = currentLevel === 'manage' ? 'manage' : 'view';
            } else {
                // If unchecking view, manage must also be disabled
                nextLevel = 'none';
            }

            return { ...prev, [moduleKey]: nextLevel };
        });
    };

    // Handle toggling the "Gestionar" switch
    const handleToggleManage = (moduleKey: string, checked: boolean) => {
        if (currentRole.is_system_admin) return;

        setPermissionsState((prev) => {
            let nextLevel: 'none' | 'view' | 'manage';

            if (checked) {
                // Manage automatically implies View
                nextLevel = 'manage';
            } else {
                // Unchecking manage downgrades to View
                nextLevel = 'view';
            }

            return { ...prev, [moduleKey]: nextLevel };
        });
    };

    // Save modified permissions to backend
    const handleSavePermissions = () => {
        if (!currentRole || currentRole.is_system_admin) return;

        setIsSaving(true);
        router.put(
            `/roles/${currentRole.id}`,
            {
                name: currentRole.name,
                slug: currentRole.slug,
                description: currentRole.description,
                color: currentRole.color,
                permissions: permissionsState,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSaving(false);
                    setSaveSuccessMessage('¡Permisos actualizados y guardados exitosamente!');
                    setTimeout(() => setSaveSuccessMessage(null), 4000);
                },
                onError: () => {
                    setIsSaving(false);
                },
            },
        );
    };

    // Discard unsaved changes
    const handleDiscardChanges = () => {
        if (currentRole) {
            setPermissionsState({ ...currentRole.module_permissions });
            setSaveSuccessMessage(null);
        }
    };

    // Confirm deletion of a role
    const confirmDelete = () => {
        if (!roleToDelete) return;

        if (roleToDelete.is_system_admin) {
            alert('El rol del sistema no se puede eliminar.');
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
                // Switch to another role if deleted role was selected
                if (selectedRoleId === roleToDelete.id && roles[0]) {
                    setSelectedRoleId(roles[0].id);
                }
            },
        });
    };

    // Filter modules by search query
    const filteredModules = useMemo(() => {
        if (!searchQuery.trim()) return modules;
        const q = searchQuery.toLowerCase();
        return modules.filter(
            (m) =>
                m.name.toLowerCase().includes(q) ||
                m.description.toLowerCase().includes(q) ||
                m.key.toLowerCase().includes(q),
        );
    }, [modules, searchQuery]);

    // Map module keys to representative Lucide icons
    const getModuleIcon = (key: string) => {
        switch (key) {
            case 'propiedades':
                return <Building2 className="size-4 text-blue-600 dark:text-blue-400" />;
            case 'proyectos':
                return <FolderKanban className="size-4 text-indigo-600 dark:text-indigo-400" />;
            case 'articulos':
                return <FileText className="size-4 text-amber-600 dark:text-amber-400" />;
            case 'usuarios':
                return <Users className="size-4 text-emerald-600 dark:text-emerald-400" />;
            case 'roles':
                return <ShieldCheck className="size-4 text-purple-600 dark:text-purple-400" />;
            default:
                return <Layers className="size-4 text-slate-500" />;
        }
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
                            MATRIZ DE PRIVILEGIOS POR MÓDULO CON CONTROL DE VER Y GESTIONAR
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={() => {
                            setEditingRole(null);
                            setIsSheetOpen(true);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b1a30] px-5 py-2.5 text-xs font-bold tracking-wide text-white shadow-xs transition-all hover:bg-[#15233c] hover:shadow cursor-pointer"
                    >
                        <Plus className="size-4 stroke-[2.5]" />
                        <span>+ Nuevo Rol</span>
                    </Button>
                </div>

                {/* Role Picker Dropdown */}
                <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4 dark:border-white/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        SELECCIONAR ROL:
                    </span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="inline-flex items-center gap-3 rounded-xl border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-50 hover:text-slate-900 focus:outline-hidden dark:border-white/10 dark:bg-[#0d1627] dark:text-slate-100 dark:hover:bg-slate-800 cursor-pointer min-w-[260px] justify-between"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="flex size-6 items-center justify-center rounded-lg shadow-2xs transition-colors"
                                        style={{
                                            backgroundColor: `color-mix(in srgb, ${currentRole.color || '#8b5cf6'} 15%, transparent)`,
                                            color: currentRole.color || '#8b5cf6',
                                        }}
                                    >
                                        <Shield className="size-3.5" />
                                    </div>
                                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                                        {currentRole.name}
                                    </span>
                                    <RoleBadge
                                        name={currentRole.is_system_admin ? 'Sistema' : `${currentRole.users_count} ${currentRole.users_count === 1 ? 'usr' : 'usrs'}`}
                                        color={currentRole.color}
                                        size="sm"
                                        icon={null}
                                    />
                                </div>
                                <ChevronDown className="size-4 text-slate-400 transition-transform duration-200" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="start"
                            className="w-80 rounded-2xl border-slate-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-[#0d1627]"
                        >
                            <DropdownMenuLabel className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Roles del Sistema ({roles.length})
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="my-1 border-slate-100 dark:border-white/5" />

                            {roles.map((role) => {
                                const isSelected = role.id === currentRole.id;
                                return (
                                    <DropdownMenuItem
                                        key={role.id}
                                        onClick={() => setSelectedRoleId(role.id)}
                                        className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold cursor-pointer transition-colors ${
                                            isSelected
                                                ? 'bg-slate-100 font-bold text-[#0b1a30] dark:bg-slate-800 dark:text-white'
                                                : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div
                                                className="flex size-6 items-center justify-center rounded-lg shrink-0 transition-colors"
                                                style={{
                                                    backgroundColor: `color-mix(in srgb, ${role.color || '#8b5cf6'} 15%, transparent)`,
                                                    color: role.color || '#8b5cf6',
                                                }}
                                            >
                                                <Shield className="size-3.5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                    {role.name}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    {role.slug}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <RoleBadge
                                                name={role.is_system_admin ? 'Sistema' : `${role.users_count} ${role.users_count === 1 ? 'usr' : 'usrs'}`}
                                                color={role.color}
                                                size="sm"
                                                icon={null}
                                            />
                                            {isSelected && <Check className="size-4 text-slate-900 dark:text-white stroke-[2.5]" />}
                                        </div>
                                    </DropdownMenuItem>
                                );
                            })}

                            <DropdownMenuSeparator className="my-1 border-slate-100 dark:border-white/5" />
                            <DropdownMenuItem
                                onClick={() => {
                                    setEditingRole(null);
                                    setIsSheetOpen(true);
                                }}
                                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30 cursor-pointer"
                            >
                                <Plus className="size-4 stroke-[2.5]" />
                                <span>+ Crear nuevo rol...</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Selected Role Meta Card */}
                {currentRole && (
                    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#0d1627]">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {currentRole.name}
                                    </h2>
                                    <span className="font-mono text-xs text-slate-400">
                                        slug: {currentRole.slug}
                                    </span>
                                    <RoleBadge
                                        name={currentRole.is_system_admin ? 'Administrador Principal' : currentRole.name}
                                        color={currentRole.color}
                                        size="sm"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {currentRole.description || 'Sin descripción asignada para este rol.'}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setEditingRole(currentRole);
                                        setIsSheetOpen(true);
                                    }}
                                    className="rounded-xl border-slate-200 text-xs py-2 px-3 gap-1.5 cursor-pointer dark:border-slate-700"
                                >
                                    <Pencil className="size-3.5" />
                                    <span>Editar Datos</span>
                                </Button>

                                {!currentRole.is_system_admin && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={currentRole.users_count > 0}
                                        onClick={() => setRoleToDelete(currentRole)}
                                        title={
                                            currentRole.users_count > 0
                                                ? 'Reasigne los usuarios antes de eliminar este rol'
                                                : 'Eliminar este rol'
                                        }
                                        className="rounded-xl border-slate-200 text-xs py-2 px-3 gap-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:hover:bg-rose-950/30"
                                    >
                                        <Trash2 className="size-3.5" />
                                        <span>Eliminar</span>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Banner for System Admin */}
                        {currentRole.is_system_admin && (
                            <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-blue-200/80 bg-blue-50/80 p-3 text-xs text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-200">
                                <Info className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                                <span>
                                    <strong>Rol de Seguridad del Sistema:</strong> Este rol posee control total y permanente en todos los módulos. Los switches permanecen activados para proteger la integridad del sistema.
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Filter and Save Action Bar */}
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-[#0d1627]">
                    {/* Search Filter */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar permiso o módulo por nombre o descripción..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 transition-colors focus:border-slate-400 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
                        />
                    </div>

                    {/* Actions and Status */}
                    <div className="flex items-center gap-3">
                        {saveSuccessMessage && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="size-4" />
                                <span>{saveSuccessMessage}</span>
                            </span>
                        )}

                        {hasUnsavedChanges && !currentRole.is_system_admin && (
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                    ● Cambios sin guardar
                                </span>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleDiscardChanges}
                                    className="rounded-xl text-xs py-1.5 px-3 border-slate-200 dark:border-slate-700"
                                >
                                    Descartar
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleSavePermissions}
                                    disabled={isSaving}
                                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-4 shadow-xs"
                                >
                                    {isSaving && <Spinner className="mr-1.5" />}
                                    Guardar Cambios
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Table with switches grouped per module */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-white/10 dark:bg-[#0d1627]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-white/10 dark:bg-slate-900/40">
                                    <th className="py-4 pl-6 pr-4">MÓDULO / PERMISO</th>
                                    <th className="px-4 py-4">DESCRIPCIÓN DE PRIVILEGIOS</th>
                                    <th className="px-4 py-4 text-center">VER</th>
                                    <th className="px-4 py-4 text-center">GESTIONAR</th>
                                    <th className="py-4 pl-4 pr-6 text-right">ESTADO ACTUAL</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm dark:divide-white/5">
                                {filteredModules.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400">
                                            No se encontraron módulos ni permisos coincidentes con la búsqueda.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredModules.map((mod) => {
                                        const currentLevel = permissionsState[mod.key] || 'none';
                                        const isViewActive = currentLevel === 'view' || currentLevel === 'manage';
                                        const isManageActive = currentLevel === 'manage';
                                        const isLocked = currentRole.is_system_admin;

                                        return (
                                            <React.Fragment key={mod.key}>
                                                {/* Group Header Row for the Module */}
                                                <tr className="bg-slate-50/40 border-t border-b border-slate-200/60 dark:bg-slate-900/20 dark:border-white/5">
                                                    <td colSpan={5} className="py-2.5 pl-6 pr-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex size-6 items-center justify-center rounded-lg bg-white shadow-xs dark:bg-slate-800">
                                                                {getModuleIcon(mod.key)}
                                                            </div>
                                                            <span className="text-xs font-extrabold tracking-wide text-[#0b1a30] uppercase dark:text-white">
                                                                MÓDULO: {mod.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Permission Row under the Module */}
                                                <tr className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                                                    {/* Módulo / Permiso */}
                                                    <td className="py-4 pl-8 pr-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-slate-900 dark:text-white">
                                                                Acceso a {mod.name}
                                                            </span>
                                                            <span className="text-[11px] font-mono text-slate-400">
                                                                modulo:{mod.key}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Descripción */}
                                                    <td className="px-4 py-4 text-xs text-slate-600 dark:text-slate-300 max-w-md">
                                                        {mod.description}
                                                    </td>

                                                    {/* Switch VER */}
                                                    <td className="px-4 py-4 text-center">
                                                        <div className="flex flex-col items-center justify-center gap-1">
                                                            <Switch
                                                                checked={isViewActive}
                                                                disabled={isLocked}
                                                                onCheckedChange={(checked) =>
                                                                    handleToggleView(mod.key, checked)
                                                                }
                                                                title={
                                                                    isLocked
                                                                        ? 'Protegido por el sistema'
                                                                        : 'Permiso de visualización'
                                                                }
                                                            />
                                                            <span className="text-[10px] font-semibold text-slate-400">
                                                                {isViewActive ? 'Activado' : 'Inactivo'}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Switch GESTIONAR */}
                                                    <td className="px-4 py-4 text-center">
                                                        <div className="flex flex-col items-center justify-center gap-1">
                                                            <Switch
                                                                checked={isManageActive}
                                                                disabled={isLocked}
                                                                onCheckedChange={(checked) =>
                                                                    handleToggleManage(mod.key, checked)
                                                                }
                                                                title={
                                                                    isLocked
                                                                        ? 'Protegido por el sistema'
                                                                        : 'Permiso de gestión y edición'
                                                                }
                                                            />
                                                            <span className="text-[10px] font-semibold text-slate-400">
                                                                {isManageActive ? 'Activado' : 'Inactivo'}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Estado Actual Badge */}
                                                    <td className="py-4 pl-4 pr-6 text-right">
                                                        {isManageActive ? (
                                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                                                <Check className="size-3.5 stroke-[2.5]" />
                                                                <span>Ver y Gestionar</span>
                                                            </span>
                                                        ) : isViewActive ? (
                                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                                                <Eye className="size-3.5" />
                                                                <span>Solo Ver</span>
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                                                <span>Sin Acceso</span>
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Sheet for Role General Metadata */}
            <RoleSheet
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                role={editingRole}
                modules={modules}
            />

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
                            Estás a punto de eliminar el perfil{' '}
                            <strong className="text-slate-800 dark:text-slate-200">{roleToDelete?.name}</strong>.
                            Esta acción es permanente y no se puede deshacer.
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
