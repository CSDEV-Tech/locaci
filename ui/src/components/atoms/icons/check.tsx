import * as React from 'react';
import { WeighedIconProps } from './types';

export function CheckIcon({ className, weight = 'regular' }: WeighedIconProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={className}
                fill="currentColor"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <polyline
                    points="216 72 104 184 48 128"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'regular' ? '16' : '24'}></polyline>
            </svg>
        </>
    );
}
