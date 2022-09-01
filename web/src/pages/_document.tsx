import * as React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            {/*  Preload fonts */}
            <Head key={'document-head'}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin={`true`}
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
