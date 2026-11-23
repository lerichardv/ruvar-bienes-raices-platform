import { Link, usePage } from '@inertiajs/react';
import { Bell, Search, Settings } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { edit as editProfile } from '@/routes/profile';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const initials = user?.name
        ? user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : 'CR';

    const displayName = user?.name
        ? user.name.split(' ')[0] + ' ' + (user.name.split(' ')[1]?.[0] ? user.name.split(' ')[1][0] + '.' : '')
        : 'John D.';

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4 transition-[width,height] ease-linear md:px-6 dark:border-white/10 dark:bg-[#0b121e]">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white" />
                <div className="hidden sm:block">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                {/* Search Bar */}
                <div className="relative hidden md:block w-64 lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar propiedades, clientes..."
                        className="w-full rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 transition-colors focus:border-slate-400 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
                    />
                </div>

                {/* Notifications Bell */}
                <button
                    type="button"
                    className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                    aria-label="Notificaciones"
                >
                    <Bell className="size-4" />
                    <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                </button>

                {/* Settings Gear */}
                <Link
                    href={editProfile()}
                    className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                    aria-label="Configuración"
                >
                    <Settings className="size-4" />
                </Link>

                {/* User quick badge */}
                <Link
                    href={editProfile()}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-3 transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/80"
                >
                    <span className="flex size-7 items-center justify-center rounded-full bg-[#0b1a30] text-xs font-bold text-white">
                        {initials}
                    </span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                        {displayName}
                    </span>
                </Link>
            </div>
        </header>
    );
}
