import * as React from 'react';
import { IconProps } from './types';

export function MapIcon(props: IconProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                {...props}
                fill="currentColor"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <polyline
                    points="96 184 32 200 32 56 96 40"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></polyline>
                <polygon
                    points="160 216 96 184 96 40 160 72 160 216"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></polygon>
                <polyline
                    points="160 72 224 56 224 200 160 216"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></polyline>
            </svg>
        </>
    );
}
