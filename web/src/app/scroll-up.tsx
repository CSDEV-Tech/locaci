// FIXME: this is only necessary while https://github.com/vercel/next.js/issues/42492 remains open
'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import * as React from 'react';

/**
 * This component helps to scroll to top on link navigation
 */
export function ScrollUp() {
    const path = usePathname();
    const searchParams = useSearchParams();

    React.useEffect(() => {
        if (path !== '/search') {
            window.document.scrollingElement?.scrollTo(0, 0);
        } else {
            document.querySelector('main')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        }
    }, [path, searchParams?.toString()]);

    return null;
}
