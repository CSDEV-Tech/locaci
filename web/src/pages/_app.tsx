import '../styles/globals.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { trpc } from '../utils/trpc-rq-hooks';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
            <ReactQueryDevtools />
        </>
    );
}

export default trpc.withTRPC(MyApp);
