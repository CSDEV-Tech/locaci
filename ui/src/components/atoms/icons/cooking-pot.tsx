import * as React from 'react';
import { IconProps } from './types';

export function CookingPotIcon({ ...props }: IconProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                {...props}
                fill="currentColor"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <path
                    d="M48,80H208a8,8,0,0,1,8,8v96a23.9,23.9,0,0,1-24,24H64a23.9,23.9,0,0,1-24-24V88A8,8,0,0,1,48,80Z"
                    opacity="0.2"></path>
                <line
                    x1="96"
                    y1="16"
                    x2="96"
                    y2="48"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></line>
                <line
                    x1="128"
                    y1="16"
                    x2="128"
                    y2="48"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></line>
                <line
                    x1="160"
                    y1="16"
                    x2="160"
                    y2="48"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></line>
                <path
                    d="M48,80H208a8,8,0,0,1,8,8v96a23.9,23.9,0,0,1-24,24H64a23.9,23.9,0,0,1-24-24V88A8,8,0,0,1,48,80Z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
                <line
                    x1="248"
                    y1="96"
                    x2="216"
                    y2="120"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></line>
                <line
                    x1="8"
                    y1="96"
                    x2="40"
                    y2="120"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></line>
            </svg>
        </>
    );
}
