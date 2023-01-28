import * as React from 'react';
// components
import {
    LinkButton,
    type LinkButtonProps
} from '@locaci/ui/components/atoms/link-button';

// utils
import { Link } from '@remix-run/react';

// types
import type { CustomLink } from '@locaci/ui/components/atoms/link';

export const RemixLink = React.forwardRef<HTMLAnchorElement, CustomLink>(
    ({ dynamic, href, ...props }, ref) => {
        return (
            <Link
                {...props}
                ref={ref}
                // We purposelly ignore hydration errors because overwise react would shout at us
                suppressHydrationWarning
                to={href}
            />
        );
    }
);

export function RemixLinkButton(props: Omit<LinkButtonProps, 'Custom'>) {
    return <LinkButton {...props} Custom={RemixLink} />;
}
