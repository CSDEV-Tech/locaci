import * as React from 'react';
import type { WeighedIconProps } from './types';

export function XIcon({ weight = 'regular', ...props }: WeighedIconProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                {...props}
                fill="currentColor"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <line
                    x1="200"
                    y1="56"
                    x2="56"
                    y2="200"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'regular' ? '16' : '24'}></line>
                <line
                    x1="200"
                    y1="200"
                    x2="56"
                    y2="56"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'regular' ? '16' : '24'}></line>
            </svg>
        </>
    );
}
