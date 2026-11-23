import { Link, usePage } from '@inertiajs/react';
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
                {/* User quick badge */}
                <Link
                    href={editProfile()}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-3 transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/80 cursor-pointer"
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
