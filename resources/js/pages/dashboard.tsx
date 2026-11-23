import { Head } from '@inertiajs/react';
import {
    Building2,
    Eye,
    FileText,
    Filter,
    MapPin,
    MessageSquare,
    Pencil,
    Plus,
    Search,
    Tag,
    Trash2,
    TrendingUp,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { dashboard } from '@/routes';

interface Property {
    id: number;
    name: string;
    location: string;
    price: string;
    priceNumeric: number;
    type: 'Venta' | 'Alquiler';
    isNewConstruction?: boolean;
    address: string;
    image: string;
}

const initialProperties: Property[] = [
    {
        id: 1,
        name: 'Villa Almara',
        location: 'COSTA MEDITERRÁNEA, MÁLAGA',
        price: '€ 4.800.000',
        priceNumeric: 4800000,
        type: 'Venta',
        isNewConstruction: true,
        address: 'Calle de las Sirenas, 12, Málaga',
        image: '/images/properties/villa1.jpg',
    },
    {
        id: 2,
        name: 'Refugio Cumbre',
        location: 'BOSQUES EXCLUSIVOS, PIRINEOS',
        price: '€ 2.200.000',
        priceNumeric: 2200000,
        type: 'Venta',
        isNewConstruction: false,
        address: 'Camino Forestal Alto, 44, Pirineos',
        image: '/images/properties/villa2.jpg',
    },
    {
        id: 3,
        name: 'Mansión Pacífico',
        location: 'ACANTILADOS MARINOS, COSTA BRAVA',
        price: '€ 9.500.000',
        priceNumeric: 9500000,
        type: 'Venta',
        isNewConstruction: true,
        address: 'Avenida de los Faros, 5, Costa Brava',
        image: '/images/properties/villa3.jpg',
    },
    {
        id: 4,
        name: 'Ático Lujo Vista al Mar',
        location: 'PLAYA SAN JUAN, ALICANTE',
        price: '€ 7500 / mes',
        priceNumeric: 7500,
        type: 'Alquiler',
        isNewConstruction: false,
        address: 'Av. Niza, Bloque C, Alicante',
        image: '/images/properties/villa4.jpg',
    },
    {
        id: 5,
        name: 'Villa Contemporánea',
        location: 'LA ZAGALETA, MARBELLA',
        price: '€ 6.200.000',
        priceNumeric: 6200000,
        type: 'Venta',
        isNewConstruction: true,
        address: 'Urbanización La Zagaleta, Marbella',
        image: '/images/properties/villa5.jpg',
    },
    {
        id: 6,
        name: 'Residencia Los Pinos',
        location: 'LA MORALEJA, MADRID',
        price: '€ 3.850.000',
        priceNumeric: 3850000,
        type: 'Venta',
        isNewConstruction: false,
        address: 'Paseo del Conde de los Gaitanes, 28, Madrid',
        image: '/images/properties/villa6.jpg',
    },
];

export default function Dashboard() {
    const [properties, setProperties] = useState<Property[]>(initialProperties);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('Todos');
    const [selectedBudget, setSelectedBudget] = useState('Cualquiera');
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    const filteredProperties = useMemo(() => {
        return properties.filter((prop) => {
            const matchesQuery =
                prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prop.address.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType =
                selectedType === 'Todos' ||
                prop.type === selectedType ||
                (selectedType === 'Obra Nueva' && prop.isNewConstruction);

            let matchesBudget = true;
            if (selectedBudget === 'under3m') {
                matchesBudget = prop.priceNumeric <= 3000000;
            } else if (selectedBudget === '3m-6m') {
                matchesBudget = prop.priceNumeric > 3000000 && prop.priceNumeric <= 6000000;
            } else if (selectedBudget === 'over6m') {
                matchesBudget = prop.priceNumeric > 6000000;
            }

            return matchesQuery && matchesType && matchesBudget;
        });
    }, [properties, searchQuery, selectedType, selectedBudget]);

    const totalCount = properties.length;
    const forSaleCount = properties.filter((p) => p.type === 'Venta').length;
    const forRentCount = properties.filter((p) => p.type === 'Alquiler').length;
    const newConstructionCount = properties.filter((p) => p.isNewConstruction).length;

    const handleDelete = (id: number, name: string) => {
        setProperties((prev) => prev.filter((p) => p.id !== id));
        setActionMessage(`Propiedad "${name}" eliminada temporalmente`);
        setTimeout(() => setActionMessage(null), 3000);
    };

    return (
        <>
            <Head title="Resumen General - Ruvar Bienes Raíces" />

            <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#f8fafc] dark:bg-[#080d16]">
                {/* Notification toast if action performed */}
                {actionMessage && (
                    <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-medium text-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-2">
                        {actionMessage}
                    </div>
                )}

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

                    <button
                        type="button"
                        onClick={() => {
                            setActionMessage('Formulario de nueva propiedad listo para incorporar');
                            setTimeout(() => setActionMessage(null), 3000);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b1a30] px-5 py-2.5 text-xs font-bold tracking-wide text-white shadow-sm transition-all hover:bg-[#15233c] hover:shadow focus:outline-none cursor-pointer"
                    >
                        <Plus className="size-4 stroke-[2.5]" />
                        <span>+ Nueva Propiedad</span>
                    </button>
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
                                {totalCount}
                            </div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                {forSaleCount} en venta · {forRentCount} en alquiler
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

                {/* Filters Row */}
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-[#0d1627]">
                    {/* Search query input */}
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filtrar por nombre, zona, dirección..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 transition-colors focus:border-slate-400 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
                        />
                    </div>

                    {/* Dropdowns */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500 uppercase tracking-wider text-[11px]">TIPO:</span>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            >
                                <option value="Todos">Todos</option>
                                <option value="Venta">Venta</option>
                                <option value="Alquiler">Alquiler</option>
                                <option value="Obra Nueva">Obra Nueva</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-slate-500 uppercase tracking-wider text-[11px]">PRESUPUESTO:</span>
                            <select
                                value={selectedBudget}
                                onChange={(e) => setSelectedBudget(e.target.value)}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            >
                                <option value="Cualquiera">Cualquiera</option>
                                <option value="under3m">Hasta € 3.000.000</option>
                                <option value="3m-6m">€ 3.000.000 - € 6.000.000</option>
                                <option value="over6m">Más de € 6.000.000</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Property Data Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-white/10 dark:bg-[#0d1627]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200/80 bg-slate-50/60 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-white/10 dark:bg-slate-900/40">
                                    <th className="py-4 pl-6 pr-3">IMAGEN</th>
                                    <th className="px-4 py-4">NOMBRE</th>
                                    <th className="px-4 py-4">PRECIO</th>
                                    <th className="px-4 py-4">TIPO</th>
                                    <th className="px-4 py-4">DIRECCIÓN</th>
                                    <th className="py-4 pl-4 pr-6 text-right">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm dark:divide-white/5">
                                {filteredProperties.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400">
                                            No se encontraron propiedades con los filtros seleccionados.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProperties.map((property) => (
                                        <tr
                                            key={property.id}
                                            className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                                        >
                                            {/* Imagen */}
                                            <td className="py-4 pl-6 pr-3">
                                                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 shadow-xs dark:border-white/10">
                                                    <img
                                                        src={property.image}
                                                        alt={property.name}
                                                        className="size-full object-cover transition-transform duration-300 hover:scale-105"
                                                    />
                                                </div>
                                            </td>

                                            {/* Nombre & Zona */}
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 dark:text-white">
                                                        {property.name}
                                                    </span>
                                                    <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                                                        {property.location}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Precio */}
                                            <td className="px-4 py-4">
                                                <span className="font-black text-slate-900 dark:text-white">
                                                    {property.price}
                                                </span>
                                            </td>

                                            {/* Tipo Badge */}
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold ${
                                                        property.type === 'Venta'
                                                            ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                                            : 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300'
                                                    }`}
                                                >
                                                    {property.type}
                                                </span>
                                            </td>

                                            {/* Dirección */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                    <MapPin className="size-3.5 shrink-0 text-slate-400" />
                                                    <span className="truncate max-w-xs">{property.address}</span>
                                                </div>
                                            </td>

                                            {/* Acciones */}
                                            <td className="py-4 pl-4 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-2 text-slate-400">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActionMessage(`Detalles de ${property.name}`);
                                                            setTimeout(() => setActionMessage(null), 3000);
                                                        }}
                                                        className="rounded-lg p-1.5 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                                        title="Ver detalles"
                                                    >
                                                        <Eye className="size-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActionMessage(`Modo edición para ${property.name}`);
                                                            setTimeout(() => setActionMessage(null), 3000);
                                                        }}
                                                        className="rounded-lg p-1.5 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                                        title="Editar propiedad"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(property.id, property.name)}
                                                        className="rounded-lg p-1.5 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                                                        title="Eliminar propiedad"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
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
