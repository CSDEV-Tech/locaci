import * as React from 'react';
import type { WeighedIconProps } from './types';

export function CalendarBlankIcon({
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
                    x="40"
                    y="40"
                    width="176"
                    height="176"
                    rx="8"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'regular' ? '16' : '24'}></rect>
                <line
                    x1="176"
                    y1="24"
                    x2="176"
                    y2="56"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'regular' ? '16' : '24'}></line>
                <line
                    x1="80"
                    y1="24"
                    x2="80"
                    y2="56"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'regular' ? '16' : '24'}></line>
                <line
                    x1="40"
                    y1="88"
                    x2="216"
                    y2="88"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'regular' ? '16' : '24'}></line>
            </svg>
        </>
    );
}
