import * as React from 'react';
import type { WeighedIconProps } from './types';

export function CopyIcon({ weight, ...props }: WeighedIconProps) {
    return (
        <>
            {weight === 'fill' ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    {...props}
                    fill="currentColor"
                    viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none"></rect>
                    <path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32Zm-8,128H176V88a8,8,0,0,0-8-8H96V48H208Z"></path>
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    {...props}
                    fill="currentColor"
                    viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none"></rect>
                    <polyline
                        points="168 168 216 168 216 40 88 40 88 88"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={
                            weight === 'bold' ? '24' : '16'
                        }></polyline>
                    <rect
                        x="40"
                        y="88"
                        width="128"
                        height="128"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={weight === 'bold' ? '24' : '16'}></rect>
                </svg>
            )}
        </>
    );
}
