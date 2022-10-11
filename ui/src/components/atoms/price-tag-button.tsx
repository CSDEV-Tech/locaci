import * as React from 'react';
import { clsx, formatNumberToFCFA } from '../../lib/functions';

export type PriceTagButtonProps = {
    price: number;
    className?: string;
    title?: string;
    selected?: boolean;
    onClick?: () => void;
};

export function PriceTagButton({
    price,
    className,
    title,
    onClick,
    selected = false
}: PriceTagButtonProps) {
    return (
        <button
            onClick={onClick}
            aria-label={title}
            aria-pressed={selected}
            className={clsx(
                className,
                `rounded-full bg-white text-sm font-bold`,
                `py-2 px-4`,
                `hover:bg-primary hover:text-white`,
                `transition duration-300 hover:scale-105`,
                `[&[aria-pressed=true]]:bg-primary [&[aria-pressed=true]]:text-white`
            )}>
            {formatNumberToFCFA(price)}
        </button>
    );
}
