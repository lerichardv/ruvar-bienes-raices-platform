import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/logo-white.png"
            alt="RUVAR"
            {...props}
            className={`object-contain ${props.className || 'size-7'}`}
        />
    );
}
