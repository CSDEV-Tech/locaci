import * as React from 'react';
import { clsx } from '../../lib/functions';

export type CardProps = {
    animated?: boolean;
    className?: string;
    children?: React.ReactNode;
};

export function Card({ className, children, animated = false }: CardProps) {
    return (
        <article
            className={clsx(
                `rounded-lg bg-white shadow-md`,
                `inline-flex`,
                className,
                {
                    'transition duration-300 ease-in-out hover:scale-105 active:scale-105':
                        animated,
                    'hover:shadow-card': animated
                }
            )}>
            {children}
        </article>
    );
}
