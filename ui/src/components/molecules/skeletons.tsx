import * as React from 'react';
import { clsx } from '../../lib/functions';
// Components
import { Skeleton, SkeletonProps } from '../atoms/skeleton';

export type SkeletonsProps = SkeletonProps & {
    count: number;
    skeletonClass?: string;
};

export function Skeletons({
    count,
    className,
    as,
    skeletonClass
}: SkeletonsProps) {
    return (
        <div className={clsx(className)}>
            {Array.from({ length: count }).map((_, index) => (
                <Skeleton key={index} as={as} className={skeletonClass} />
            ))}
        </div>
    );
}
