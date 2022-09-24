import * as React from 'react';
import { clsx, formatNumberToFCFA } from '../../lib/functions';

export type PriceTagButtonProps = {
    price: number;
    className?: string;
    title?: string;
    onClick?: () => void;
};

export function PriceTagButton({
    price,
    className,
    title,
    onClick
}: PriceTagButtonProps) {
    return (
        <button
            onClick={onClick}
            aria-label={title}
            className={clsx(
                className,
                `group inline-flex flex-col items-center gap-2`
            )}>
            <div
                className={clsx(
                    `rounded-full bg-white text-sm font-bold`,
                    `py-2 px-4`,
                    `group-hover:bg-primary group-hover:text-white`,
                    `transition duration-300 group-hover:scale-105`
                )}>
                {formatNumberToFCFA(price)}
            </div>
        </button>
    );
}
