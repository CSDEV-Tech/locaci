import * as React from 'react';
import { clsx } from '../../lib/functions';

export type CardProps = {
    animated?: boolean;
    className?: string;
    children?: React.ReactNode;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
};

export function Card({
    className,
    children,
    animated = false,
    onMouseEnter,
    onMouseLeave
}: CardProps) {
    return (
        <article
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={clsx(
                `rounded-lg bg-white shadow-md`,
                `inline-flex`,
                className,
                {
                    'transition duration-300 ease-in-out focus-within:scale-105 hover:scale-105 active:scale-105':
                        animated,
                    'focus-within:shadow-card hover:shadow-card active:shadow-card':
                        animated
                }
            )}>
            {children}
        </article>
    );
}
