import * as React from 'react';
import type { WeighedIconProps } from './types';

export function QuotesIcon({ weight = 'regular', ...props }: WeighedIconProps) {
    return (
        <>
            {weight === 'fill' ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    {...props}
                    width="192"
                    height="192"
                    fill="currentColor"
                    viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none"></rect>
                    <path d="M116,72v88a48,48,0,0,1-48,48,8,8,0,0,1,0-16,32.1,32.1,0,0,0,32-32v-8H40a16,16,0,0,1-16-16V72A16,16,0,0,1,40,56h60A16,16,0,0,1,116,72ZM216,56H156a16,16,0,0,0-16,16v64a16,16,0,0,0,16,16h60v8a32.1,32.1,0,0,1-32,32,8,8,0,0,0,0,16,48,48,0,0,0,48-48V72A16,16,0,0,0,216,56Z"></path>
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    {...props}
                    fill="currentColor"
                    viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none"></rect>
                    <path
                        d="M108,144H40a8,8,0,0,1-8-8V72a8,8,0,0,1,8-8h60a8,8,0,0,1,8,8v88a40,40,0,0,1-40,40"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={weight === 'regular' ? '16' : '24'}></path>
                    <path
                        d="M224,144H156a8,8,0,0,1-8-8V72a8,8,0,0,1,8-8h60a8,8,0,0,1,8,8v88a40,40,0,0,1-40,40"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={weight === 'regular' ? '16' : '24'}></path>
                </svg>
            )}
        </>
    );
}
