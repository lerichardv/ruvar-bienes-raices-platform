interface AppLogoProps {
    variant?: 'light' | 'dark' | 'auto';
    className?: string;
    showSubtitle?: boolean;
}

export default function AppLogo({
    variant = 'dark',
    className = '',
}: AppLogoProps) {
    const logoSrc = variant === 'light' ? '/images/logo-transparent.png' : '/images/logo-white.png';

    return (
        <div className={`flex items-center justify-center gap-3 py-1 ${className}`}>
            <img
                src={logoSrc}
                alt="RUVAR Bienes Raíces"
                className="h-10 w-auto object-contain transition-transform duration-200"
            />
        </div>
    );
}
