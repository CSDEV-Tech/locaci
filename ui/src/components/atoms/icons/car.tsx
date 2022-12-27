import * as React from 'react';
import { IconProps } from './types';

export function CarIcon({ ...props }: IconProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                {...props}
                fill="currentColor"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <path
                    d="M224,184v24a8,8,0,0,1-8,8H192a8,8,0,0,1-8-8V184Z"
                    opacity="0.2"></path>
                <path
                    d="M72,184v24a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V184Z"
                    opacity="0.2"></path>
                <path
                    d="M224,120,194.1,52.8a8,8,0,0,0-7.3-4.8H69.2a8,8,0,0,0-7.3,4.8L32,120Z"
                    opacity="0.2"></path>
                <line
                    x1="16"
                    y1="120"
                    x2="240"
                    y2="120"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></line>
                <path
                    d="M224,184v24a8,8,0,0,1-8,8H192a8,8,0,0,1-8-8V184"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
                <path
                    d="M72,184v24a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V184"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
                <line
                    x1="64"
                    y1="152"
                    x2="80"
                    y2="152"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></line>
                <line
                    x1="176"
                    y1="152"
                    x2="192"
                    y2="152"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></line>
                <path
                    d="M224,120,194.1,52.8a8,8,0,0,0-7.3-4.8H69.2a8,8,0,0,0-7.3,4.8L32,120v64H224Z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
            </svg>
        </>
    );
}
