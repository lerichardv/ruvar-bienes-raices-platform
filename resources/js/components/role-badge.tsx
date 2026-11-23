import { Shield } from 'lucide-react';
import React from 'react';

export const ROLE_COLOR_PRESETS = [
    { label: 'Púrpura', value: '#8b5cf6', ring: 'ring-purple-400' },
    { label: 'Azul Real', value: '#2563eb', ring: 'ring-blue-400' },
    { label: 'Ámbar Cálido', value: '#d97706', ring: 'ring-amber-400' },
    { label: 'Pizarra', value: '#475569', ring: 'ring-slate-400' },
    { label: 'Esmeralda', value: '#059669', ring: 'ring-emerald-400' },
    { label: 'Rosa Rubí', value: '#e11d48', ring: 'ring-rose-400' },
    { label: 'Índigo', value: '#4f46e5', ring: 'ring-indigo-400' },
    { label: 'Cian', value: '#0891b2', ring: 'ring-cyan-400' },
    { label: 'Naranja Teja', value: '#ea580c', ring: 'ring-orange-400' },
    { label: 'Grafito', value: '#334155', ring: 'ring-slate-600' },
] as const;

export function getRoleColorStyles(color?: string) {
    const hex = color || '#8b5cf6';
    return {
        backgroundColor: `color-mix(in srgb, ${hex} 10%, transparent)`,
        borderColor: `color-mix(in srgb, ${hex} 25%, transparent)`,
        color: hex,
    };
}

export function RoleBadge({
    name,
    color,
    icon: Icon = Shield,
    className = '',
    size = 'default',
}: {
    name: string;
    color?: string;
    icon?: React.ElementType | null;
    className?: string;
    size?: 'sm' | 'default' | 'lg';
}) {
    const styles = getRoleColorStyles(color);
    const sizeClasses = {
        sm: 'text-[10px] px-2 py-0.5 gap-1 font-semibold',
        default: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
        lg: 'text-xs sm:text-sm px-3 py-1.5 gap-2 font-bold',
    }[size];

    const iconSizeClasses = {
        sm: 'size-2.5',
        default: 'size-3',
        lg: 'size-3.5',
    }[size];

    return (
        <span
            style={styles}
            className={`inline-flex items-center rounded-lg border transition-all ${sizeClasses} ${className}`}
        >
            {Icon && <Icon className={`${iconSizeClasses} shrink-0`} />}
            <span>{name}</span>
        </span>
    );
}
