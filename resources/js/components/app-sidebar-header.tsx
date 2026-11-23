import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { logout } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

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
                {/* User Dropdown Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-3 transition-colors hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-800 cursor-pointer focus:outline-hidden"
                        >
                            <span className="flex size-7 items-center justify-center rounded-full bg-[#0b1a30] text-xs font-bold text-white shadow-xs">
                                {initials}
                            </span>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                                {displayName}
                            </span>
                            <ChevronDown className="size-3.5 text-slate-400" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-56 rounded-2xl border-slate-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-[#0d1627]"
                    >
                        <DropdownMenuLabel className="px-2.5 py-1.5 font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {user?.name || 'Usuario'}
                                </p>
                                <p className="text-[11px] text-slate-400 truncate">
                                    {user?.email || ''}
                                </p>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator className="my-1 border-slate-100 dark:border-white/5" />

                        <DropdownMenuItem asChild>
                            <Link
                                href={editProfile()}
                                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                            >
                                <User className="size-4 text-slate-400" />
                                <span>Ver Perfil</span>
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-1 border-slate-100 dark:border-white/5" />

                        <DropdownMenuItem asChild>
                            <Link
                                href={logout()}
                                method="post"
                                as="button"
                                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 cursor-pointer"
                            >
                                <LogOut className="size-4" />
                                <span>Cerrar Sesión</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
