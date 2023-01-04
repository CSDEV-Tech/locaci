'use client';
import * as React from 'react';
// components
import Link from 'next/link';
import {
    LinkButton,
    type LinkButtonProps
} from '@locaci/ui/components/atoms/link-button';

// utils
import { useRouter } from 'next/navigation';

// types
import type { CustomLink } from '@locaci/ui/components/atoms/link';

export const NextLink = React.forwardRef<HTMLAnchorElement, CustomLink>(
    (props, ref) => {
        return <Link {...props} ref={ref} />;
    }
);

export function NextLinkButton(props: Omit<LinkButtonProps, 'Custom'>) {
    return <LinkButton {...props} Custom={NextLink} />;
}

export function NextDynamicLinkButton(props: Omit<LinkButtonProps, 'Custom'>) {
    return <LinkButton {...props} Custom={NextDynamicLink} />;
}

export const NextDynamicLink = React.forwardRef<HTMLAnchorElement, CustomLink>(
    ({ href, children, ...props }, forwardedRef) => {
        const router = useRouter();
        return (
            <a
                {...props}
                ref={forwardedRef}
                href={href}
                onClick={e => {
                    if (!href.startsWith(`#`)) {
                        e.preventDefault();
                        React.startTransition(() => {
                            // push should happen in a transition to not block the UI
                            router.push(href);
                        });
                    }
                }}>
                {children}
            </a>
        );
    }
);
