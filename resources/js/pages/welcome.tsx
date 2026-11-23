import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Building2, Key, ShieldCheck, Sparkles } from 'lucide-react';
import { dashboard, login } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Bienvenido - Ruvar Bienes Raíces" />

            <div className="flex min-h-screen flex-col bg-[#f8fafc] text-slate-800 dark:bg-[#070e1c] dark:text-slate-100">
                {/* Navbar */}
                <header className="flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 backdrop-blur-md md:px-12 dark:border-white/10 dark:bg-[#070e1c]/80">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/logo-transparent.png"
                            alt="RUVAR Bienes Raíces"
                            className="h-10 w-auto object-contain dark:hidden"
                        />
                        <img
                            src="/images/logo-white.png"
                            alt="RUVAR Bienes Raíces"
                            className="h-10 w-auto object-contain hidden dark:block"
                        />
                    </div>

                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#0b1a30] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#15233c]"
                            >
                                <span>Ir al Panel</span>
                                <ArrowRight className="size-3.5" />
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#0b1a30] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#15233c]"
                            >
                                <span>Iniciar Sesión</span>
                                <ArrowRight className="size-3.5" />
                            </Link>
                        )}
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center md:px-12">
                    <div className="max-w-3xl space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-600 shadow-2xs dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                            <Sparkles className="size-3.5 text-amber-500" />
                            <span>Plataforma de Gestión Inmobiliaria de Alto Nivel</span>
                        </div>

                        <h1 className="text-4xl font-black tracking-tight text-[#0b1a30] sm:text-5xl lg:text-6xl dark:text-white uppercase">
                            RUVAR BIENES RAÍCES
                        </h1>

                        <p className="mx-auto max-w-xl text-sm md:text-base font-normal leading-relaxed text-slate-600 dark:text-slate-300">
                            Gestión integral y administración de propiedades de lujo, proyectos residenciales exclusivos y portafolios de inversión inmobiliaria premium.
                        </p>

                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b1a30] px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#15233c] hover:shadow-lg"
                                >
                                    <span>Acceder al Panel de Gestión</span>
                                    <ArrowRight className="size-4" />
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b1a30] px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#15233c] hover:shadow-lg"
                                >
                                    <span>Acceder al Panel de Control</span>
                                    <ArrowRight className="size-4" />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mt-16 grid w-full max-w-4xl grid-cols-1 gap-6 text-left sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[#0d1627]">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                                <Building2 className="size-5" />
                            </div>
                            <h2 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                                Propiedades Exclusivas
                            </h2>
                            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                                Listados en venta y alquiler con filtrado inteligente por presupuesto, ubicación y tipología.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[#0d1627]">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                                <Key className="size-5" />
                            </div>
                            <h2 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                                Control de Operaciones
                            </h2>
                            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                                Seguimiento en tiempo real de unidades disponibles, en venta y nuevas promociones.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[#0d1627]">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                                <ShieldCheck className="size-5" />
                            </div>
                            <h2 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                                Seguridad Empresarial
                            </h2>
                            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                                Autenticación robusta y control de roles y permisos para el equipo administrativo.
                            </p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500 dark:border-white/10 dark:bg-[#070e1c] dark:text-slate-400">
                    <p>© {new Date().getFullYear()} Ruvar Bienes Raíces. Todos los derechos reservados.</p>
                </footer>
            </div>
        </>
    );
}
