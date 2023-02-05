import * as React from 'react';
import { clsx } from '../../lib/functions';

export type SkeletonProps = {
    as?: typeof HTMLElement['name'];
    className?: string;
    roundedCorners?: boolean;
    'aria-label'?: string;
};

export function Skeleton({
    as,
    className,
    roundedCorners = false,
    'aria-label': ariaLabel
}: SkeletonProps) {
    const Tag = as ?? 'div';
    return (
        <Tag
            aria-label={ariaLabel}
            // @ts-ignore
            className={clsx(
                className,
                'relative overflow-x-hidden bg-gray/20',
                'after:absolute after:inset-0 after:animate-shimmer after:bg-gradient-to-r',
                'after:from-transparent after:via-gray/30 after:to-transparent',
                {
                    'rounded-md': roundedCorners
                }
            )}
        />
    );
}
