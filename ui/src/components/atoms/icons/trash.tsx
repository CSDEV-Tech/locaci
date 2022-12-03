import * as React from 'react';
import type { WeighedIconProps } from './types';

export function TrashIcon({ weight = 'regular', ...props }: WeighedIconProps) {
    return (
        <>
            {weight === 'fill' ? (
                <>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        {...props}
                        fill="currentColor"
                        viewBox="0 0 256 256">
                        <rect width="256" height="256" fill="none"></rect>
                        <path d="M216,48H176V40a24.1,24.1,0,0,0-24-24H104A24.1,24.1,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM112,168a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm0-120H96V40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Z"></path>
                    </svg>
                </>
            ) : (
                <svg {...props} fill="currentColor" viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none"></rect>
                    <line
                        x1="216"
                        y1="56"
                        x2="40"
                        y2="56"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={weight === 'regular' ? '16' : '24'}></line>
                    <line
                        x1="104"
                        y1="104"
                        x2="104"
                        y2="168"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={weight === 'regular' ? '16' : '24'}></line>
                    <line
                        x1="152"
                        y1="104"
                        x2="152"
                        y2="168"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={weight === 'regular' ? '16' : '24'}></line>
                    <path
                        d="M200,56V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V56"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={weight === 'regular' ? '16' : '24'}></path>
                    <path
                        d="M168,56V40a16,16,0,0,0-16-16H104A16,16,0,0,0,88,40V56"
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
