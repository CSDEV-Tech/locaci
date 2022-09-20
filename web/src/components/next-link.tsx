import Link from 'next/link';
import { CustomLink, LinkButton, LinkButtonProps } from '@locaci/ui';

export function NextLink(props: CustomLink) {
    return <Link {...props} />;
}

export function NextLinkButton(props: Omit<LinkButtonProps, 'Custom'>) {
    return <LinkButton {...props} Custom={NextLink} />;
}
