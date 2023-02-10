import * as React from 'react';
import { clsx, formatNumberToFCFA } from '../../lib/functions';

export type PriceTagButtonProps = {
    price: number;
    className?: string;
    title?: string;
    selected?: boolean;
    onClick?: () => void;
    id: string;
    'data-type'?: string;
};

export function PriceTagButton({
    price,
    className,
    title,
    onClick,
    id,
    selected = false,
    'data-type': type
}: PriceTagButtonProps) {
    return (
        <button
            onClick={onClick}
            id={id}
            aria-label={title}
            data-type={type}
            aria-pressed={selected}
            className={clsx(
                className,
                `rounded-full bg-white text-sm font-bold`,
                `py-2 px-4`,
                `hover:bg-primary hover:text-white`,
                `transition duration-300 hover:scale-105`,
                `[&[aria-pressed=true]]:bg-primary [&[aria-pressed=true]]:text-white`,
                `[&[data-selected="true"]]:bg-primary [&[data-selected="true"]]:text-white`
            )}>
            {formatNumberToFCFA(price)}
        </button>
    );
}
