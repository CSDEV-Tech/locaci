import * as React from 'react';
import { IconProps } from './types';

export function DropIcon({ ...props }: IconProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                {...props}
                fill="currentColor"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <path
                    d="M208,144c0-72-80-128-80-128S48,72,48,144a80,80,0,0,0,160,0Z"
                    opacity="0.2"></path>
                <path
                    d="M208,144c0-72-80-128-80-128S48,72,48,144a80,80,0,0,0,160,0Z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
                <path
                    d="M136.1,191.2a47.9,47.9,0,0,0,39.2-39.1"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
            </svg>
        </>
    );
}
