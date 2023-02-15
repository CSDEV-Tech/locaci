import '~/styles/globals.css';

// components
import { TrpcClientProvider } from '~/app/trpc-client-provider';
import { TailwindIndicator } from '~/features/shared/components/tailwind-indicator';
import { HotToaster } from '~/features/shared/components/hot-toaster';
import { RASSRProvider } from '~/features/shared/components/react-aria-ssr-provider';
import { ScrollUp } from './scroll-up';

// utils
import { Poppins } from '@next/font/google';
import { env } from '~/env/server.mjs';

// types
import type { LayoutProps } from '~/next-app-types';
import type { Metadata } from 'next';

const poppins = Poppins({
    subsets: ['latin'],
    variable: '--font-poppins',
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap'
});

export const metadata: Metadata = {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: {
        default: 'Trouvez votre prochain Logement en quelques clics | LOCACI',
        template: '%s | LOCACI'
    },

    description:
        "Découvrez le premier site de recherche et gestion locative de Côte d'Ivoire, pour les bailleurs & locataires.",
    openGraph: {
        title: {
            default:
                'Trouvez votre prochain Logement en quelques clics | LOCACI',
            template: '%s | LOCACI'
        },
        description:
            "Découvrez le premier site de recherche et gestion locative de Côte d'Ivoire, pour les bailleurs & locataires.",
        url: new URL(`/`, env.NEXT_PUBLIC_SITE_URL),
        images: [new URL(`/logo.png`, env.NEXT_PUBLIC_SITE_URL)],
        siteName: 'LOCACI',
        locale: 'fr-FR'
    },
    twitter: {
        card: 'summary_large_image',
        title: {
            default:
                'Trouvez votre prochain Logement en quelques clics | LOCACI',
            template: '%s | LOCACI'
        },
        description:
            "Découvrez le premier site de recherche et gestion locative de Côte d'Ivoire, pour les bailleurs & locataires.",
        images: [
            {
                url: new URL(`/logo.png`, env.NEXT_PUBLIC_SITE_URL)
            }
        ]
    }
};

export default function RootLayout({ children }: LayoutProps) {
    return (
        <html lang="fr" className={poppins.className} suppressHydrationWarning>
            <body suppressHydrationWarning>
                <ScrollUp />
                <RASSRProvider>
                    <TrpcClientProvider>{children}</TrpcClientProvider>
                </RASSRProvider>
                <TailwindIndicator />
                <HotToaster position="top-center" />
            </body>
        </html>
    );
}
