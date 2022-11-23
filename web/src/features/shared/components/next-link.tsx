'use client';

import Link from 'next/link';
import type { CustomLink } from '@locaci/ui/components/atoms/link';
import {
    LinkButton,
    type LinkButtonProps
} from '@locaci/ui/components/atoms/link-button';

export function NextLink(props: CustomLink) {
    return <Link {...props} />;
}

export function NextLinkButton(props: Omit<LinkButtonProps, 'Custom'>) {
    return <LinkButton {...props} Custom={NextLink} />;
}
