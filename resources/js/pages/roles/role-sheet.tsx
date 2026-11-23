import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
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

export interface RoleItem {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    users_count: number;
    is_system_admin: boolean;
    module_permissions: Record<string, 'none' | 'view' | 'manage'>;
}

export interface SystemModule {
    key: string;
    name: string;
    description: string;
}

interface RoleSheetProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    role: RoleItem | null;
    modules: SystemModule[];
    onSuccess?: () => void;
}

export function RoleSheet({
    isOpen,
    onOpenChange,
    role,
    modules,
    onSuccess,
}: RoleSheetProps) {
    const isEditing = Boolean(role);

    const defaultPermissions = modules.reduce(
        (acc, mod) => {
            acc[mod.key] = 'none';
            return acc;
        },
        {} as Record<string, string>,
    );

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        name: '',
        slug: '',
        description: '',
        permissions: defaultPermissions,
    });

    useEffect(() => {
        clearErrors();
        if (role) {
            setData({
                name: role.name,
                slug: role.slug,
                description: role.description || '',
                permissions: { ...role.module_permissions },
            });
        } else {
            setData({
                name: '',
                slug: '',
                description: '',
                permissions: { ...defaultPermissions },
            });
        }
    }, [role, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && role) {
            put(`/roles/${role.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    onSuccess?.();
                },
            });
        } else {
            post('/roles', {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    onSuccess?.();
                },
            });
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="w-full sm:max-w-md p-6 bg-white dark:bg-[#0d1627] flex flex-col justify-between overflow-y-auto"
            >
                <div className="space-y-6">
                    <SheetHeader className="text-left pb-4 border-b border-slate-100 dark:border-white/10">
                        <SheetTitle className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            {isEditing ? `Editar: ${role?.name}` : 'Crear Nuevo Rol'}
                        </SheetTitle>
                        <SheetDescription className="text-xs text-slate-500 dark:text-slate-400">
                            {isEditing
                                ? 'Modifica el nombre y descripción del rol. Los permisos por módulo se configuran en la tabla principal.'
                                : 'Ingresa los datos generales para dar de alta un nuevo perfil de usuario en el sistema.'}
                        </SheetDescription>
                    </SheetHeader>

                    <form id="role-sheet-form" onSubmit={handleSubmit} className="space-y-4 pt-2">
                        {/* Nombre del Rol */}
                        <div className="space-y-1.5">
                            <Label htmlFor="role-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Nombre del Perfil / Rol *
                            </Label>
                            <Input
                                id="role-name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Ej. Supervisor de Ventas"
                                required
                                className="rounded-xl border-slate-200 py-2 text-xs dark:border-slate-700"
                            />
                            {errors.name && (
                                <p className="text-[11px] font-medium text-rose-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Slug identificador */}
                        <div className="space-y-1.5">
                            <Label htmlFor="role-slug" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Slug Identificador
                            </Label>
                            <Input
                                id="role-slug"
                                type="text"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                placeholder="supervisor-de-ventas (automático si está vacío)"
                                disabled={role?.is_system_admin}
                                className="rounded-xl border-slate-200 py-2 text-xs font-mono dark:border-slate-700"
                            />
                            {errors.slug && (
                                <p className="text-[11px] font-medium text-rose-600">{errors.slug}</p>
                            )}
                        </div>

                        {/* Descripción */}
                        <div className="space-y-1.5">
                            <Label htmlFor="role-description" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Descripción de Responsabilidades
                            </Label>
                            <textarea
                                id="role-description"
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe el alcance y propósitos de este rol..."
                                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 transition-colors focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            />
                            {errors.description && (
                                <p className="text-[11px] font-medium text-rose-600">{errors.description}</p>
                            )}
                        </div>
                    </form>
                </div>

                <SheetFooter className="border-t border-slate-100 pt-5 mt-6 dark:border-white/10 flex flex-row gap-3 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl text-xs py-2 px-4 border-slate-200 dark:border-slate-700"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        form="role-sheet-form"
                        disabled={processing}
                        className="rounded-xl bg-[#0b1a30] text-xs font-bold text-white hover:bg-[#15233c] py-2 px-6 shadow-xs transition-all"
                    >
                        {processing && <Spinner className="mr-2" />}
                        {isEditing ? 'Guardar Cambios' : 'Crear Rol'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
