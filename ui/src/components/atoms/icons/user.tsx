import * as React from 'react';
import { WeighedIconProps } from './types';

export function UserIcon({ weight = 'regular', ...props }: WeighedIconProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                {...props}
                fill="currentColor"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <circle
                    cx="128"
                    cy="96"
                    r="64"
                    fill="none"
                    stroke="currentColor"
                    stroke-miterlimit="10"
                    stroke-width={weight === 'bold' ? '24' : '16'}></circle>
                <path
                    d="M31,216a112,112,0,0,1,194,0"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width={weight === 'bold' ? '24' : '16'}></path>
            </svg>
        </>
    );
}
