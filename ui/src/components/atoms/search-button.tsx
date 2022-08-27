import { MagnifyingGlass } from 'phosphor-react';
import * as React from 'react';
import { clsx } from '../../lib/functions';

export type SearchButtonProps = {
    className?: string;
    children?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export function SearchButton({
    className,
    children,
    onClick
}: SearchButtonProps) {
    return (
        <button
            className={clsx(
                className,
                'border-2 border-[#EDE8E9] rounded-md',
                'flex gap-4 items-center justify-between px-3 py-2',
                'text-gray font-semibold text-sm  max-w-[180px]',
                'md:px-4 md:text-base md:max-w-[300px]'
            )}
            onClick={onClick}>
            <span className="whitespace-nowrap text-ellipsis overflow-hidden w-full">
                {children}
            </span>

            <div>
                <MagnifyingGlass
                    className="h-4 w-4 text-primary"
                    weight="bold"
                />
            </div>
        </button>
    );
}
