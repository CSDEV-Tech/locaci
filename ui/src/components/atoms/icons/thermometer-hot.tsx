import * as React from 'react';
import { IconProps } from './types';

export function ThermometerHotIcon({ ...props }: IconProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                {...props}
                fill="currentColor"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <circle
                    cx="120"
                    cy="188"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></circle>
                <line
                    x1="120"
                    y1="168"
                    x2="120"
                    y2="48"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></line>
                <path
                    d="M240.3,80A20,20,0,0,1,212,80a20,20,0,0,0-28.3,0"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
                <path
                    d="M240.3,120a20,20,0,0,1-28.3,0,20,20,0,0,0-28.3,0"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
                <path
                    d="M88,147V48a32,32,0,0,1,64,0v99h0a52,52,0,1,1-64,0Z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
                <path
                    d="M152,147h0V48a32,32,0,0,0-64,0v99h0a52,52,0,1,0,64,0Zm-32,61a20,20,0,1,1,20-20A20.1,20.1,0,0,1,120,208Z"
                    opacity="0.2"></path>
            </svg>
        </>
    );
}
