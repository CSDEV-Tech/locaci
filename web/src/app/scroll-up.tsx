// FIXME: this is only necessary while https://github.com/vercel/next.js/issues/42492 remains open
'use client';
import { usePathname } from 'next/navigation';
import * as React from 'react';

/**
 * This component helps to scroll to top on link navigation
 */
export function ScrollUp() {
    const path = usePathname();

    React.useEffect(() => {
        window.document.scrollingElement?.scrollTo(0, 0);
    }, [path]);

    return null;
}
