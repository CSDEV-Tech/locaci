import * as React from 'react';
import { IconProps } from './types';

export function UmbrellaIcon({ ...props }: IconProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                {...props}
                fill="currentColor"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <path
                    d="M32.3,136a7.9,7.9,0,0,1-7.9-8.7,104,104,0,0,1,207.2,0,7.9,7.9,0,0,1-7.9,8.7Z"
                    opacity="0.2"></path>
                <path
                    d="M176,200a24,24,0,0,1-48,0V136"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
                <path
                    d="M32.3,136a7.9,7.9,0,0,1-7.9-8.7,104,104,0,0,1,207.2,0,7.9,7.9,0,0,1-7.9,8.7Z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
            </svg>
        </>
    );
}
