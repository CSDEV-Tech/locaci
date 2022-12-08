import * as React from 'react';
import { WeighedIconProps } from './types';

export function RefreshIcon({
    className,
    weight = 'regular'
}: WeighedIconProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={className}
                fill="currentColor"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <polyline
                    points="79.8 99.7 31.8 99.7 31.8 51.7"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'bold' ? '24' : '16'}></polyline>
                <path
                    d="M190.2,65.8a87.9,87.9,0,0,0-124.4,0l-34,33.9"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'bold' ? '24' : '16'}></path>
                <polyline
                    points="176.2 156.3 224.2 156.3 224.2 204.3"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'bold' ? '24' : '16'}></polyline>
                <path
                    d="M65.8,190.2a87.9,87.9,0,0,0,124.4,0l34-33.9"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'bold' ? '24' : '16'}></path>
            </svg>
        </>
    );
}
