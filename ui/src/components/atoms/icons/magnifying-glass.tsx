import * as React from 'react';
import type { WeighedIconProps } from './types';

export function MagnifyIngGlassIcon({
    weight = 'regular',
    ...props
}: WeighedIconProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                {...props}
                fill="currentColor"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <circle
                    cx="116"
                    cy="116"
                    r="84"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'regular' ? '16' : '24'}></circle>
                <line
                    x1="175.4"
                    y1="175.4"
                    x2="224"
                    y2="224"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'regular' ? '16' : '24'}></line>
            </svg>
        </>
    );
}
