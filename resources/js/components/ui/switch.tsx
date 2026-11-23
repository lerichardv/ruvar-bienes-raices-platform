import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    (
        {
            className,
            checked: controlledChecked,
            defaultChecked = false,
            onCheckedChange,
            disabled,
            onClick,
            ...props
        },
        ref,
    ) => {
        const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
        const isControlled = controlledChecked !== undefined;
        const checked = isControlled ? controlledChecked : uncontrolledChecked;

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (disabled) return;
            const newChecked = !checked;
            if (!isControlled) {
                setUncontrolledChecked(newChecked);
            }
            onCheckedChange?.(newChecked);
            onClick?.(e);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                handleClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
            }
        };

        return (
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                data-state={checked ? 'checked' : 'unchecked'}
                disabled={disabled}
                ref={ref}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                className={cn(
                    'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
                    checked
                        ? 'bg-[#0b1a30] dark:bg-blue-600'
                        : 'bg-slate-200 dark:bg-slate-700',
                    className,
                )}
                {...props}
            >
                <span
                    data-state={checked ? 'checked' : 'unchecked'}
                    className={cn(
                        'pointer-events-none block size-4 rounded-full bg-white shadow-lg ring-0 transition-transform',
                        checked ? 'translate-x-4' : 'translate-x-0',
                    )}
                />
            </button>
        );
    },
);
Switch.displayName = 'Switch';

export { Switch };
