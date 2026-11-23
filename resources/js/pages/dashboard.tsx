import { Head } from '@inertiajs/react';
import { Building2, FileText, MessageSquare } from 'lucide-react';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <>
            <Head title="Resumen General - Ruvar Bienes Raíces" />

            <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#f8fafc] dark:bg-[#080d16]">
                {/* Header section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-[#0b1a30] dark:text-white uppercase">
                            RESUMEN GENERAL
                        </h1>
                        <p className="mt-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            PANEL DE CONTROL, ACTIVIDAD Y MÉTRICAS DE RUVAR BIENES RAÍCES
                        </p>
                    </div>
                </div>

                {/* 3 Cartas Resumen: Cantidad de Propiedades, Comentarios en Propiedades y Artículos */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {/* Carta 1: Cantidad de Propiedades */}
                    <div className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-shadow hover:shadow-sm dark:border-white/10 dark:bg-[#0d1627]">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                            <Building2 className="size-7" />
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                CANTIDAD DE PROPIEDADES
                            </span>
                            <div className="text-3xl font-black text-slate-900 dark:text-white">
                                6
                            </div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                4 en venta · 2 en alquiler
                            </p>
                        </div>
                    </div>

                    {/* Carta 2: Comentarios en Propiedades */}
                    <div className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-shadow hover:shadow-sm dark:border-white/10 dark:bg-[#0d1627]">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <MessageSquare className="size-7" />
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                COMENTARIOS EN PROPIEDADES
                            </span>
                            <div className="text-3xl font-black text-slate-900 dark:text-white">
                                24
                            </div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Consultas y opiniones de clientes
                            </p>
                        </div>
                    </div>

                    {/* Carta 3: Artículos */}
                    <div className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-shadow hover:shadow-sm dark:border-white/10 dark:bg-[#0d1627]">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                            <FileText className="size-7" />
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                ARTÍCULOS PUBLICADOS
                            </span>
                            <div className="text-3xl font-black text-slate-900 dark:text-white">
                                12
                            </div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Publicaciones y novedades del sector
                            </p>
                        </div>
                    </div>
                </div>

                {/* Área de Contenido Posterior (En preparación) */}
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 p-12 text-center shadow-xs dark:border-white/10 dark:bg-[#0d1627]/50">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                        <Building2 className="size-6" />
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-200">
                        Área de contenido en preparación
                    </h3>
                    <p className="mt-1 max-w-sm text-xs text-slate-400">
                        Los nuevos listados y paneles de control se integrarán aquí próximamente.
                    </p>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Escritorio',
            href: dashboard(),
        },
        {
            title: 'RESUMEN',
            href: dashboard(),
        },
    ],
};
