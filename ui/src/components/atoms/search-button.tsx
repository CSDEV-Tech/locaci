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
                'rounded-md border-2 border-[#EDE8E9]',
                'flex items-center justify-between gap-4 px-3 py-2',
                'max-w-[180px] text-sm font-semibold  text-gray',
                'md:max-w-[300px] md:px-4 md:text-base'
            )}
            onClick={onClick}
        >
            <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
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
