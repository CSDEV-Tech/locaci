import * as React from 'react';
import { clsx } from '../../lib/functions';

export type ProgressProps = {
    value: number;
    min?: number;
    max?: number;
    className?: string;
    variant?: 'primary' | 'secondary';
};

export function Progress({
    value,
    className,
    variant = 'primary',
    min = 0,
    max = 100
}: ProgressProps) {
    // Calculate the width in percent
    let widthPercent = ((value - min) / (max - min)) * 100;
    if (widthPercent <= 0) {
        widthPercent = 0;
    } else if (widthPercent >= 100) {
        widthPercent = 100;
    }

    return (
        <div
            className={clsx(
                className,
                'relative w-full h-2 rounded-md bg-gray',
                {
                    'bg-primary-15': variant === 'primary',
                    'bg-secondary-15': variant === 'secondary'
                }
            )}>
            <div
                className={clsx('absolute left-0 rounded-md h-full', {
                    'bg-primary': variant === 'primary',
                    'bg-secondary': variant === 'secondary'
                })}
                style={{
                    width: `${widthPercent}%`
                }}
            />
        </div>
    );
}
