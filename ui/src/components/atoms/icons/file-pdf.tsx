import * as React from 'react';
import type { IconProps } from './types';

export function FilePdfIcon(props: IconProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                {...props}
                fill="currentColor"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <path
                    d="M48,128V40a8,8,0,0,1,8-8h96l56,56v40"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
                <polyline
                    points="152 32 152 88 208 88"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></polyline>
                <path
                    d="M48,200H64a16,16,0,0,0,0-32H48v48"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
                <polyline
                    points="216 168 188 168 188 216"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></polyline>
                <line
                    x1="212"
                    y1="196"
                    x2="188"
                    y2="196"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></line>
                <path
                    d="M128,216a24,24,0,0,0,0-48H114v48Z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
            </svg>
        </>
    );
}
