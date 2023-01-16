import * as React from 'react';
import { clsx } from '../../lib/functions';

export type CustomLinkComponentType =
    | React.ComponentType<CustomLink>
    | React.ForwardRefExoticComponent<
          CustomLink & React.RefAttributes<HTMLAnchorElement>
      >;

export type LinkProps = {
    href: string;
    className?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    children?: React.ReactNode;
    'aria-label'?: string;
    rel?: string;
    'aria-current'?: React.AriaAttributes['aria-current'];
    Custom?: CustomLinkComponentType;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    dynamic?: boolean;
} & Omit<React.HTMLProps<HTMLAnchorElement>, 'ref'>;

export type CustomLink = Omit<LinkProps, 'Custom'>;

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
    (
        {
            children,
            className,
            Custom,
            href,
            target,
            onClick,
            rel,
            'aria-label': ariaLabel,
            'aria-current': ariaCurrent,
            ...restProps
        },
        ref
    ) => {
        if (Custom) {
            return (
                <Custom
                    onClick={onClick}
                    rel={rel}
                    ref={ref}
                    aria-current={ariaCurrent}
                    aria-label={ariaLabel}
                    children={children}
                    className={clsx(className)}
                    href={href}
                    {...restProps}
                />
            );
        }

        return (
            <a
                rel={rel}
                ref={ref}
                onClick={onClick}
                aria-label={ariaLabel}
                aria-current={ariaCurrent}
                className={clsx(className)}
                href={href}
                {...restProps}
                target={target}>
                {children}
            </a>
        );
    }
);
