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

export const NextDynamicLink = React.forwardRef<HTMLAnchorElement, CustomLink>(
    ({ href, children, ...props }, forwardedRef) => {
        const router = useRouter();
        const [hasBeenPrefetched, setHasBeenPrefetched] = React.useState(false);
        const [isPrefetching, startTransition] = React.useTransition();
        const localRef = React.useRef<HTMLAnchorElement>();

        React.useEffect(() => {
            if (localRef.current) {
                const options = {
                    rootMargin: '0px',
                    threshold: 0.5
                };

                const observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            if (!hasBeenPrefetched && !isPrefetching) {
                                // eagerly prefetch route for faster route transition, when link is visible
                                startTransition(() => {
                                    router.prefetch(href);
                                    setHasBeenPrefetched(true);

                                    // remove IntersectionObserver on finish
                                    if (localRef.current) {
                                        observer.unobserve(localRef.current);
                                    }
                                });
                            }
                        }
                    });
                }, options);

                observer.observe(localRef.current);

                return () => {
                    // remove IntersectionObserver on unMount
                    if (localRef.current) {
                        observer.unobserve(localRef.current);
                    }
                };
            }
            return;
        }, []);

        return (
            <a
                {...props}
                ref={instance => {
                    // first we set the local ref
                    localRef.current = instance ?? undefined;

                    // then we handle the forwarded ref
                    // it can be a function, an object, or null
                    if (typeof forwardedRef === 'function') {
                        forwardedRef(instance);
                    } else if (forwardedRef !== null) {
                        forwardedRef.current = instance;
                    }
                }}
                href={href}
                onClick={e => {
                    if (!href.startsWith(`#`)) {
                        e.preventDefault();
                        router.push(href);
                    }
                }}>
                {children}
            </a>
        );
    }
);
