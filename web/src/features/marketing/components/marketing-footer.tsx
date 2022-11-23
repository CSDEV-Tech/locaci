'use client';

import { Footer } from '@locaci/ui/components/molecules/footer';
import { NextLink } from '~/features/shared/components/next-link';

export function MarketingFooter() {
    return (
        <Footer
            className="stiky bottom-0"
            customLink={NextLink}
            // TODO : Links
            links={[]}
        />
    );
}
