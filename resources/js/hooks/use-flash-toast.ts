import { router } from '@inertiajs/react';
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
    const lastToastRef = useRef<string | null>(null);

    const handleFlash = (flash?: FlashProps | null) => {
        if (!flash) return;

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
    };

    useEffect(() => {
        // 1. Check if router already has page props on mount
        const initialPage = (
            router as unknown as {
                page?: { props?: { flash?: FlashProps } };
            }
        ).page;
        if (initialPage?.props?.flash) {
            handleFlash(initialPage.props.flash);
        }

        // 2. Listen to navigate events (fired on initial, visit, history)
        const unregisterNavigate = router.on('navigate', (event) => {
            const page = (
                event.detail as {
                    page?: { props?: { flash?: FlashProps } };
                }
            )?.page;
            if (page?.props?.flash) {
                handleFlash(page.props.flash);
            }
        });

        // 3. Listen to flash events
        const unregisterFlash = router.on('flash', (event) => {
            const flashDetail = (event as CustomEvent).detail?.flash;
            const data = flashDetail?.toast as FlashToast | undefined;
            if (data && data.type && data.message) {
                toast[data.type](data.message);
            } else if (flashDetail) {
                handleFlash(flashDetail as FlashProps);
            }
        });

        return () => {
            unregisterNavigate();
            unregisterFlash();
        };
    }, []);
}
