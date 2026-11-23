import { Link, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    FileText,
    FolderKanban,
    Home,
    LayoutGrid,
    LogOut,
    ShieldCheck,
    User,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    useSidebar,
} from '@/components/ui/sidebar';
import { dashboard, logout } from '@/routes';

export function AppSidebar() {
    const { auth } = usePage().props;
    const { url } = usePage();
    const { state } = useSidebar();
    const user = auth?.user;
    const isCollapsed = state === 'collapsed';

    const isUsersActive = url.startsWith('/usuarios') || url.startsWith('/roles');
    const [usersOpen, setUsersOpen] = useState(true);

    const initials = user?.name
        ? user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : 'CR';

    return (
        <Sidebar
            collapsible="icon"
            variant="sidebar"
            className="border-r border-white/5 bg-[#070e1c] text-slate-300"
        >
            {/* Header: Organization Logo */}
            <SidebarHeader className="border-b border-white/5 p-0">
                <div className="flex h-20 items-center justify-center px-4">
                    <Link
                        href={dashboard()}
                        className="flex items-center justify-center transition-transform hover:opacity-95"
                    >
                        <img
                            src="/images/logo-white.png"
                            alt="RUVAR Bienes Raíces"
                            className={`h-11 w-auto object-contain transition-all duration-200 ${
                                isCollapsed ? 'max-h-7 max-w-7' : 'max-h-12'
                            }`}
                        />
                    </Link>
                </div>
            </SidebarHeader>

            {/* Content: Main Navigation */}
            <SidebarContent className="px-3 py-4">
                <nav className="flex flex-col gap-1.5 text-sm">
                    {/* Resumen */}
                    <Link
                        href={dashboard()}
                        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                            url === '/dashboard' || url === '/'
                                ? 'border border-slate-700/60 bg-[#131f37] font-medium text-white shadow-sm'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <LayoutGrid className="size-4 shrink-0" />
                        {!isCollapsed && <span>Resumen</span>}
                    </Link>

                    {/* Propiedades */}
                    <Link
                        href={dashboard()}
                        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                            url.includes('propiedades')
                                ? 'border border-slate-700/60 bg-[#131f37] font-medium text-white shadow-sm'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <Home className="size-4 shrink-0" />
                        {!isCollapsed && <span>Propiedades</span>}
                    </Link>

                    {/* Proyectos */}
                    <button
                        type="button"
                        className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        <FolderKanban className="size-4 shrink-0 text-slate-400 group-hover:text-white" />
                        {!isCollapsed && <span>Proyectos</span>}
                    </button>

                    {/* Artículos */}
                    <button
                        type="button"
                        className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        <FileText className="size-4 shrink-0 text-slate-400 group-hover:text-white" />
                        {!isCollapsed && <span>Artículos</span>}
                    </button>

                    {/* Usuarios (Collapsible group) */}
                    <div className="pt-1">
                        <button
                            type="button"
                            onClick={() => setUsersOpen(!usersOpen)}
                            className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition-colors ${
                                isUsersActive
                                    ? 'text-white'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Users className="size-4 shrink-0" />
                                {!isCollapsed && <span>Usuarios</span>}
                            </div>
                            {!isCollapsed && (
                                <ChevronDown
                                    className={`size-3.5 text-slate-500 transition-transform duration-200 ${
                                        usersOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            )}
                        </button>

                        {!isCollapsed && usersOpen && (
                            <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-white/10 pl-3">
                                <Link
                                    href="/usuarios"
                                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-colors ${
                                        url.startsWith('/usuarios')
                                            ? 'border border-slate-700/60 bg-[#131f37] font-semibold text-white shadow-xs'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <User className="size-3.5" />
                                    <span>Lista de Usuarios</span>
                                </Link>

                                <Link
                                    href="/roles"
                                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-colors ${
                                        url.startsWith('/roles')
                                            ? 'border border-slate-700/60 bg-[#131f37] font-semibold text-white shadow-xs'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <ShieldCheck className="size-3.5" />
                                    <span>Roles de Usuarios</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </SidebarContent>

            {/* Footer: User profile and Logout */}
            <SidebarFooter className="border-t border-white/5 p-4">
                <div className="flex flex-col gap-3">
                    {/* User profile card */}
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#16233a] text-xs font-bold text-white ring-1 ring-white/10">
                            {initials}
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col truncate leading-tight">
                                <span className="truncate text-sm font-semibold text-white">
                                    {user?.name || 'Ricardo Valladares'}
                                </span>
                                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                    {user?.role?.name || 'ADMINISTRADOR'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Exit button */}
                    <Link
                        href={logout()}
                        method="post"
                        as="button"
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                    >
                        <LogOut className="size-3.5" />
                        {!isCollapsed && <span>SALIR DEL PANEL</span>}
                    </Link>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
