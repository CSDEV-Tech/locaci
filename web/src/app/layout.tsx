import '~/styles/globals.css';

// components
import { TrpcClientProvider } from '~/app/trpc-client-provider';
import { TailwindIndicator } from '~/features/shared/components/tailwind-indicator';
import { HotToaster } from '~/features/shared/components/hot-toaster';
import { RASSRProvider } from '~/features/shared/components/react-aria-ssr-provider';

// utils
import { Poppins } from '@next/font/google';

// types
import type { LayoutProps } from '~/types';

const poppins = Poppins({
    subsets: ['latin'],
    variable: '--font-poppins',
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap'
});

export default function RootLayout({ children }: LayoutProps) {
    return (
        <html lang="fr" className={poppins.className}>
            <head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta name="charset" content="utf-8" />
            </head>
            <body>
                <RASSRProvider>
                    <TrpcClientProvider>{children}</TrpcClientProvider>
                </RASSRProvider>
                <TailwindIndicator />
                <HotToaster position="top-center" />
            </body>
        </html>
    );
}
