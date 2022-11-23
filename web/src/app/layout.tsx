import '~/styles/globals.css';
// components
import { TrpcClientProvider } from '~/app/trpc-client-provider';
import { HotToaster } from '~/features/shared/components/hot-toaster';
import { TailwindIndicator } from '~/features/shared/components/tailwind-indicator';

// utils
import { Poppins } from '@next/font/google';

// types
import type { LayoutProps } from '~/types';

const poppins = Poppins({
    subsets: ['latin'],
    variable: '--font-poppins',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export default function RootLayout({ children }: LayoutProps) {
    return (
        <html lang="fr" className={poppins.className}>
            <head>
                <link rel="icon" href="/public/favicon.svg" />
            </head>
            <body>
                <TrpcClientProvider>{children}</TrpcClientProvider>
                <HotToaster position="top-center" />
                <TailwindIndicator />
            </body>
        </html>
    );
}
