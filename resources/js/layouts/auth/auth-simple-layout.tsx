import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#f8fafc] p-6 md:p-10 dark:bg-[#070e1c]">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6 rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#0d1627]">
                    <div className="flex flex-col items-center gap-3">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 transition-transform hover:opacity-95"
                        >
                            <img
                                src="/images/logo-transparent.png"
                                alt="RUVAR Bienes Raíces"
                                className="h-14 w-auto object-contain dark:hidden"
                            />
                            <img
                                src="/images/logo-white.png"
                                alt="RUVAR Bienes Raíces"
                                className="h-14 w-auto object-contain hidden dark:block"
                            />
                            <span className="sr-only">RUVAR Bienes Raíces</span>
                        </Link>

                        <div className="space-y-1 text-center">
                            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                                {title}
                            </h1>
                            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
