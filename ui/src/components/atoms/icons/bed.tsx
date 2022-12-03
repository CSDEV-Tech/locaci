import * as React from 'react';
import type { IconProps } from './types';

export function BedIcon({ ...props }: IconProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                {...props}
                fill="currentColor"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <path
                    d="M104,80H208a32,32,0,0,1,32,32v56a0,0,0,0,1,0,0H104a0,0,0,0,1,0,0V80A0,0,0,0,1,104,80Z"
                    opacity="0.2"></path>
                <path
                    d="M104,168V80H208a32,32,0,0,1,32,32v56"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
                <line
                    x1="16"
                    y1="208"
                    x2="16"
                    y2="48"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></line>
                <polyline
                    points="16 168 240 168 240 208"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></polyline>
                <line
                    x1="104"
                    y1="80"
                    x2="16"
                    y2="80"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></line>
            </svg>
        </>
    );
}
