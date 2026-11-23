import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    Info,
    LoaderCircle,
} from 'lucide-react';
import React from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { Toaster as Sonner, toast, type ToasterProps, type ExternalToast } from 'sonner';

/**
 * Toast service helper for programmatic toast dispatching with brand defaults.
 */
export const toastService = {
    success: (message: string, data?: ExternalToast) => toast.success(message, data),
    error: (message: string, data?: ExternalToast) => toast.error(message, data),
    info: (message: string, data?: ExternalToast) => toast.info(message, data),
    warning: (message: string, data?: ExternalToast) => toast.warning(message, data),
    loading: (message: string, data?: ExternalToast) => toast.loading(message, data),
    dismiss: (toastId?: number | string) => toast.dismiss(toastId),
    custom: toast.custom,
    promise: toast.promise,
};

/**
 * React hook to access the toast notification service.
 */
export function useToast() {
    return {
        toast: toastService,
    };
}

function Toaster({ ...props }: ToasterProps) {
    const { appearance } = useAppearance();

    useFlashToast();

    return (
        <Sonner
            theme={appearance}
            className="toaster group font-sans"
            position="top-center"
            closeButton
            richColors={false}
            expand={false}
            duration={4000}
            gap={10}
            icons={{
                success: (
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                ),
                info: (
                    <Info className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                ),
                warning: (
                    <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                ),
                error: (
                    <AlertCircle className="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
                ),
                loading: (
                    <LoaderCircle className="size-4 shrink-0 animate-spin text-slate-500" />
                ),
            }}
            toastOptions={{
                classNames: {
                    toast:
                        'group toast rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md px-4 py-3.5 pr-9 text-xs text-slate-800 shadow-xl shadow-[#0b1a30]/10 font-sans dark:border-white/10 dark:bg-[#0d1627]/95 dark:text-slate-100 flex items-center gap-3 w-full sm:w-[390px]',
                    title: 'text-xs font-bold text-slate-900 dark:text-white',
                    description: 'text-xs text-slate-500 dark:text-slate-400 mt-0.5',
                    actionButton:
                        'rounded-xl bg-[#0b1a30] text-xs font-bold text-white hover:bg-[#15233c] px-3 py-1.5 dark:bg-white dark:text-[#0b1a30]',
                    cancelButton:
                        'rounded-xl bg-slate-100 text-xs font-medium text-slate-700 hover:bg-slate-200 px-3 py-1.5 dark:bg-slate-800 dark:text-slate-300',
                    closeButton:
                        '!rounded-full !border !border-slate-200/90 !bg-white !text-slate-400 hover:!text-white hover:!bg-[#0b1a30] hover:!border-[#0b1a30] dark:!border-white/10 dark:!bg-[#0d1627] dark:!text-slate-400 dark:hover:!text-[#0b1a30] dark:hover:!bg-white dark:hover:!border-white transition-all shadow-xs cursor-pointer',
                    success:
                        '!border-emerald-200/80 !bg-emerald-50/90 !text-emerald-950 dark:!border-emerald-900/50 dark:!bg-emerald-950/40 dark:!text-emerald-100',
                    error:
                        '!border-rose-200/80 !bg-rose-50/90 !text-rose-950 dark:!border-rose-900/50 dark:!bg-rose-950/40 dark:!text-rose-100',
                    info:
                        '!border-blue-200/80 !bg-blue-50/90 !text-blue-950 dark:!border-blue-900/50 dark:!bg-blue-950/40 dark:text-blue-100',
                    warning:
                        '!border-amber-200/80 !bg-amber-50/90 !text-amber-950 dark:!border-amber-900/50 dark:!bg-amber-950/40 dark:!text-amber-100',
                },
            }}
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                } as React.CSSProperties
            }
            {...props}
        />
    );
}

export { Toaster, Toaster as ToastProvider, toast };
