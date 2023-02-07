import * as React from 'react';
import { WeighedIconProps } from './types';

export function SquareFourIcon({
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
                <rect
                    x="48"
                    y="48"
                    width="64"
                    height="64"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'bold' ? '24' : '16'}></rect>
                <rect
                    x="144"
                    y="48"
                    width="64"
                    height="64"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'bold' ? '24' : '16'}></rect>
                <rect
                    x="48"
                    y="144"
                    width="64"
                    height="64"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'bold' ? '24' : '16'}></rect>
                <rect
                    x="144"
                    y="144"
                    width="64"
                    height="64"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'bold' ? '24' : '16'}></rect>
            </svg>
        </>
    );
}
