import { CheckCircle2, Lock, Mail, Shield, User, XCircle } from 'lucide-react';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RoleOption, UserFormData } from './types';

interface UserFormProps {
    data: UserFormData;
    setData: <K extends keyof UserFormData>(key: K, value: UserFormData[K]) => void;
    errors: Partial<Record<keyof UserFormData, string>>;
    roles: RoleOption[];
    isEditing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    formId?: string;
}

export function UserForm({
    data,
    setData,
    errors,
    roles,
    isEditing,
    onSubmit,
    formId = 'user-form',
}: UserFormProps) {
    const passwordsMatch =
        data.password &&
        data.password_confirmation &&
        data.password === data.password_confirmation;

    const passwordsMismatch =
        data.password &&
        data.password_confirmation &&
        data.password !== data.password_confirmation;

    return (
        <form id={formId} onSubmit={onSubmit} className="space-y-6 pt-2">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Nombre Completo */}
                <div className="space-y-1.5">
                    <Label
                        htmlFor="user-name"
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                        <User className="size-3.5 text-slate-400" />
                        <span>Nombre Completo *</span>
                    </Label>
                    <Input
                        id="user-name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Ej. Roberto Gómez"
                        required
                        className="rounded-xl border-slate-200 py-2 text-xs transition-colors focus:border-slate-400 dark:border-slate-700"
                    />
                    {errors.name && (
                        <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Correo Electrónico */}
                <div className="space-y-1.5">
                    <Label
                        htmlFor="user-email"
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                        <Mail className="size-3.5 text-slate-400" />
                        <span>Correo Electrónico *</span>
                    </Label>
                    <Input
                        id="user-email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="correo@ruvar.com"
                        required
                        className="rounded-xl border-slate-200 py-2 text-xs transition-colors focus:border-slate-400 dark:border-slate-700"
                    />
                    {errors.email && (
                        <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Rol Asignado (spanning 2 columns) */}
                <div className="space-y-1.5 md:col-span-2">
                    <Label
                        htmlFor="user-role"
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                        <Shield className="size-3.5 text-slate-400" />
                        <span>Rol Asignado *</span>
                    </Label>
                    <div className="relative">
                        <select
                            id="user-role"
                            value={data.role_id}
                            onChange={(e) => setData('role_id', e.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 transition-colors focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                            {roles.map((r) => (
                                <option key={r.id} value={String(r.id)}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.role_id && (
                        <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                            {errors.role_id}
                        </p>
                    )}
                </div>

                {/* Contraseña */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label
                            htmlFor="user-password"
                            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
                        >
                            <Lock className="size-3.5 text-slate-400" />
                            <span>Contraseña {isEditing ? '(Opcional)' : '*'}</span>
                        </Label>
                    </div>
                    <Input
                        id="user-password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                        required={!isEditing}
                        minLength={8}
                        className="rounded-xl border-slate-200 py-2 text-xs transition-colors focus:border-slate-400 dark:border-slate-700"
                    />
                    {isEditing && (
                        <p className="text-[10px] text-slate-400">
                            Dejar vacío para conservar la contraseña actual
                        </p>
                    )}
                    {errors.password && (
                        <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Confirmar Contraseña */}
                <div className="space-y-1.5">
                    <Label
                        htmlFor="user-password-confirmation"
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                        <Lock className="size-3.5 text-slate-400" />
                        <span>Confirmar Contraseña {isEditing ? '(Opcional)' : '*'}</span>
                    </Label>
                    <Input
                        id="user-password-confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="••••••••"
                        required={!isEditing || Boolean(data.password)}
                        minLength={8}
                        className={`rounded-xl py-2 text-xs transition-colors dark:border-slate-700 ${
                            passwordsMismatch
                                ? 'border-rose-400 focus:border-rose-500'
                                : passwordsMatch
                                  ? 'border-emerald-500 focus:border-emerald-600'
                                  : 'border-slate-200 focus:border-slate-400'
                        }`}
                    />
                    {passwordsMismatch && (
                        <p className="flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                            <XCircle className="size-3" />
                            <span>Las contraseñas no coinciden</span>
                        </p>
                    )}
                    {passwordsMatch && (
                        <p className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-3" />
                            <span>Las contraseñas coinciden</span>
                        </p>
                    )}
                    {errors.password_confirmation && (
                        <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>
            </div>
        </form>
    );
}
