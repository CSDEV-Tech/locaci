import * as React from 'react';
import { IconProps } from './types';

export function StorefrontIcon({ ...props }: IconProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                {...props}
                fill="currentColor"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <path d="M96,96v16a32,32,0,0,1-64,0V96" opacity="0.2"></path>
                <path d="M224,96v16a32,32,0,0,1-64,0V96" opacity="0.2"></path>
                <path
                    d="M48,139.6V208a8,8,0,0,0,8,8H200a8,8,0,0,0,8-8V139.6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
                <path
                    d="M54,40H202a8.1,8.1,0,0,1,7.7,5.8L224,96H32L46.3,45.8A8.1,8.1,0,0,1,54,40Z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
                <path
                    d="M96,96v16a32,32,0,0,1-64,0V96"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
                <path
                    d="M160,96v16a32,32,0,0,1-64,0V96"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
                <path
                    d="M224,96v16a32,32,0,0,1-64,0V96"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
            </svg>
        </>
    );
}
