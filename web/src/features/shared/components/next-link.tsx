'use client';
import * as React from 'react';
// components
import Link from 'next/link';
import {
    LinkButton,
    type LinkButtonProps
} from '@locaci/ui/components/atoms/link-button';

// types
import type { CustomLink } from '@locaci/ui/components/atoms/link';

export const NextLink = React.forwardRef<HTMLAnchorElement, CustomLink>(
    ({ dynamic, href, ...props }, ref) => {
        return <Link {...props} ref={ref} href={href} />;
    }
);

export function NextLinkButton(props: Omit<LinkButtonProps, 'Custom'>) {
    return <LinkButton {...props} Custom={NextLink} />;
}
