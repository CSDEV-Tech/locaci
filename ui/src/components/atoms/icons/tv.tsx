import * as React from 'react';
import { IconProps } from './types';

export function TvIcon({ ...props }: IconProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                {...props}
                fill="currentColor"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <rect
                    x="32"
                    y="72"
                    width="192"
                    height="136"
                    rx="8"
                    opacity="0.2"></rect>
                <rect
                    x="32"
                    y="72"
                    width="192"
                    height="136"
                    rx="8"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></rect>
                <polyline
                    points="80 24 128 72 176 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></polyline>
            </svg>
        </>
    );
}
