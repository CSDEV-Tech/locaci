import * as React from 'react';
import { IconProps } from './types';

export function SliderIcon(props: IconProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                {...props}
                fill="currentColor"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <line
                    x1="148"
                    y1="172"
                    x2="40"
                    y2="172"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></line>
                <line
                    x1="216"
                    y1="172"
                    x2="188"
                    y2="172"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></line>
                <circle
                    cx="168"
                    cy="172"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></circle>
                <line
                    x1="84"
                    y1="84"
                    x2="40"
                    y2="84"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></line>
                <line
                    x1="216"
                    y1="84"
                    x2="124"
                    y2="84"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></line>
                <circle
                    cx="104"
                    cy="84"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></circle>
            </svg>
        </>
    );
}
