import '~/styles/globals.css';
/**
 * We import mapbox css in the root layout because when you import a css in a file
 * nextjs try to hoist it on the <head/> tag, with suspense and SSR it can cause problems
 * if imported at a random component in the tree.
 */
import 'mapbox-gl/dist/mapbox-gl.css';

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
                <meta name="viewport" content="width=device-width" />
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
