import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

interface FlashProps {
    success?: string | null;
    error?: string | null;
    info?: string | null;
    warning?: string | null;
    status?: string | null;
    toast?: FlashToast | null;
}

export function useFlashToast(): void {
    const page = usePage<{ flash?: FlashProps }>();
    const flash = page.props?.flash;
    const lastToastRef = useRef<string | null>(null);

    useEffect(() => {
        if (!flash) return;

        // Create a unique fingerprint for current flash messages
        const currentKey = [
            flash.success,
            flash.error,
            flash.info,
            flash.warning,
            flash.status,
            flash.toast?.type,
            flash.toast?.message,
        ]
            .filter(Boolean)
            .join('::');

        if (!currentKey || currentKey === lastToastRef.current) return;
        lastToastRef.current = currentKey;

        if (flash.toast) {
            toast[flash.toast.type](flash.toast.message);
        } else if (flash.success) {
            toast.success(flash.success);
        } else if (flash.error) {
            toast.error(flash.error);
        } else if (flash.info) {
            toast.info(flash.info);
        } else if (flash.warning) {
            toast.warning(flash.warning);
        } else if (flash.status) {
            toast.info(flash.status);
        }
    }, [flash]);

    useEffect(() => {
        return router.on('flash', (event) => {
            const flashDetail = (event as CustomEvent).detail?.flash;
            const data = flashDetail?.toast as FlashToast | undefined;

            if (!data) {
                return;
            }

            toast[data.type](data.message);
        });
    }, []);
}
