import '../styles/globals.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { t } from '@web/utils/trpc-rq-hooks';

// To enable layouts
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout || (page => page);

    return (
        <>
            {getLayout(<Component {...pageProps} />)}
            <ReactQueryDevtools position="bottom-right" />
        </>
    );
}

export default t.withTRPC(MyApp);
