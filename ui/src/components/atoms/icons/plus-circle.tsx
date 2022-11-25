import * as React from 'react';
import { WeighedIconProps } from './types';

export function PlusCircleIcon({
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
                    r="96"
                    fill="none"
                    stroke="currentColor"
                    strokeMiterlimit="10"
                    strokeWidth={weight === 'bold' ? '24' : '16'}></circle>
                <line
                    x1="88"
                    y1="128"
                    x2="168"
                    y2="128"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'bold' ? '24' : '16'}></line>
                <line
                    x1="128"
                    y1="88"
                    x2="128"
                    y2="168"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'bold' ? '24' : '16'}></line>
            </svg>
        </>
    );
}
