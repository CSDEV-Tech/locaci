import * as React from 'react';
import type { WeighedIconProps } from './types';

export function WarningCircleIcon({
    weight = 'regular',
    ...props
}: WeighedIconProps) {
    return (
        <>
            {weight === 'fill' ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    {...props}
                    fill="currentColor"
                    viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none"></rect>
                    <path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"></path>
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    {...props}
                    fill="currentColor"
                    viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none"></rect>
                    <circle
                        cx="128"
                        cy="128"
                        r="96"
                        fill="none"
                        stroke="currentColor"
                        stroke-miterlimit="10"
                        strokeWidth={
                            weight === 'regular' ? '16' : '24'
                        }></circle>
                    <line
                        x1="128"
                        y1="80"
                        x2="128"
                        y2="136"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={weight === 'regular' ? '16' : '24'}></line>
                    <circle cx="128" cy="172" r="12"></circle>
                </svg>
            )}
        </>
    );
}
