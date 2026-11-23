import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title="Ajustes de Apariencia - Ruvar Bienes Raíces" />

            <h1 className="sr-only">Ajustes de apariencia</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Apariencia y Tema"
                    description="Personaliza el tema visual de la plataforma para tu cuenta"
                />
                <AppearanceTabs />
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Ajustes de apariencia',
            href: editAppearance(),
        },
    ],
};
