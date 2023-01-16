'use client';
import * as React from 'react';
// components
import Link from 'next/link';
import {
    LinkButton,
    type LinkButtonProps
} from '@locaci/ui/components/atoms/link-button';

// utils
import { Uuid } from '~/lib/uuid';

// types
import type { CustomLink } from '@locaci/ui/components/atoms/link';

export const NextLink = React.forwardRef<HTMLAnchorElement, CustomLink>(
    ({ dynamic, href, ...props }, ref) => {
        /**
         * FIXME : this is a fix because nextjs caches pages even dynamic ones,
         * This codes ensures to give crawlers the correct url, while making it possible for
         * nextjs to always fetch the page, by prefixing it with a random queryString
         */
        const randomQueryString =
            typeof window !== undefined ? new Uuid().short() : '';
        const qs = new URLSearchParams();
        if (randomQueryString) {
            qs.append('__r', randomQueryString);
        }

        return (
            <Link
                {...props}
                ref={ref}
                // We purposelly ignore hydration errors because overwise react would shout at us
                suppressHydrationWarning
                href={dynamic ? `${href}?${qs.toString()}` : href}
            />
        );
    }
);

export function NextLinkButton(props: Omit<LinkButtonProps, 'Custom'>) {
    return <LinkButton {...props} Custom={NextLink} />;
}
