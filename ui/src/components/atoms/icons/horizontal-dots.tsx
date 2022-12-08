import * as React from 'react';
import { WeighedIconProps } from './types';

export function HorizontalDotsIcon({
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
                <circle
                    cx="128"
                    cy="128"
                    r={weight === 'bold' ? '24' : '16'}></circle>
                <circle
                    cx="64"
                    cy="128"
                    r={weight === 'bold' ? '24' : '16'}></circle>
                <circle
                    cx="192"
                    cy="128"
                    r={weight === 'bold' ? '24' : '16'}></circle>
            </svg>
        </>
    );
}
