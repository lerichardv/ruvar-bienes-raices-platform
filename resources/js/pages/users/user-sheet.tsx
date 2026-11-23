import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import type { RoleOption, UserFormData, UserItem } from './types';
import { UserForm } from './user-form';

interface UserSheetProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    user: UserItem | null;
    roles: RoleOption[];
    onSuccess?: () => void;
}

export function UserSheet({
    isOpen,
    onOpenChange,
    user,
    roles,
    onSuccess,
}: UserSheetProps) {
    const isEditing = Boolean(user);

    const defaultRoleId = roles[0]?.id ? String(roles[0].id) : '';

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        clearErrors,
        setError,
    } = useForm<UserFormData>({
        name: '',
        email: '',
        role_id: defaultRoleId,
        password: '',
        password_confirmation: '',
    });

    // Populate or reset form whenever user or isOpen changes
    useEffect(() => {
        clearErrors();
        if (user) {
            setData({
                name: user.name,
                email: user.email,
                role_id: user.role_id ? String(user.role_id) : defaultRoleId,
                password: '',
                password_confirmation: '',
            });
        } else {
            setData({
                name: '',
                email: '',
                role_id: defaultRoleId,
                password: '',
                password_confirmation: '',
            });
        }
    }, [user, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side confirmation guard
        if (data.password && data.password !== data.password_confirmation) {
            setError('password_confirmation', 'Las contraseñas no coinciden.');
            return;
        }

        if (isEditing && user) {
            put(`/usuarios/${user.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    onSuccess?.();
                },
            });
        } else {
            post('/usuarios', {
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
                className="w-full sm:max-w-xl md:max-w-2xl p-6 sm:p-8 bg-white dark:bg-[#0d1627] flex flex-col justify-between overflow-y-auto"
            >
                <div className="space-y-6">
                    <SheetHeader className="text-left pb-4 border-b border-slate-100 dark:border-white/10">
                        <SheetTitle className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
                        </SheetTitle>
                        <SheetDescription className="text-xs text-slate-500 dark:text-slate-400">
                            {isEditing
                                ? `Modifica los datos personales, rol o credenciales de ${user?.name}.`
                                : 'Ingresa la información del nuevo integrante y asigna su rol dentro de RUVAR.'}
                        </SheetDescription>
                    </SheetHeader>

                    <UserForm
                        formId="user-sheet-form"
                        data={data}
                        setData={setData}
                        errors={errors}
                        roles={roles}
                        isEditing={isEditing}
                        onSubmit={handleSubmit}
                    />
                </div>

                <SheetFooter className="border-t border-slate-100 pt-5 mt-6 dark:border-white/10 flex flex-row gap-3 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl text-xs py-2 px-4 border-slate-200 hover:bg-slate-50 dark:border-slate-700"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        form="user-sheet-form"
                        disabled={processing}
                        className="rounded-xl bg-[#0b1a30] text-xs font-bold text-white hover:bg-[#15233c] py-2 px-6 shadow-xs transition-all"
                    >
                        {processing && <Spinner className="mr-2" />}
                        {isEditing ? 'Actualizar Usuario' : 'Guardar Usuario'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
