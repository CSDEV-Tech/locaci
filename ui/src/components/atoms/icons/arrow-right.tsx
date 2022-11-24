import * as React from 'react';
import type { WeighedIconProps } from './types';

export function ArrowRightIcon({
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
                <line
                    x1="40"
                    y1="128"
                    x2="216"
                    y2="128"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'regular' ? '16' : '24'}></line>
                <polyline
                    points="144 56 216 128 144 200"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'regular' ? '16' : '24'}></polyline>
            </svg>
        </>
    );
}
