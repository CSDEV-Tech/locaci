import * as React from 'react';
import type { WeighedIconProps } from './types';

export function EyeSlashIcon({
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
                    <path d="M247.3,124.8c-.3-.8-8.8-19.6-27.6-38.5C194.6,61.3,162.9,48,128,48a132.4,132.4,0,0,0-22,1.8,8.1,8.1,0,0,0-4.6,13.3L202.7,174.5a8,8,0,0,0,5.9,2.6,8.6,8.6,0,0,0,5.4-2c22.8-20.5,32.9-42.9,33.3-43.8A8.2,8.2,0,0,0,247.3,124.8Z"></path>
                    <path d="M53.9,34.6A8,8,0,0,0,42.1,45.4L61.3,66.5C25,88.8,9.4,123.2,8.7,124.8a8.2,8.2,0,0,0,0,6.5c.3.7,8.8,19.5,27.6,38.4C61.4,194.7,93.1,208,128,208a126.9,126.9,0,0,0,52.1-10.8l22,24.2A8,8,0,0,0,208,224a8.2,8.2,0,0,0,5.4-2.1,7.9,7.9,0,0,0,.5-11.3ZM128,164a36,36,0,0,1-29.5-56.6l47.2,51.9A35.4,35.4,0,0,1,128,164Z"></path>
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    {...props}
                    fill="currentColor"
                    viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none"></rect>
                    <line
                        x1="48"
                        y1="40"
                        x2="208"
                        y2="216"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={weight === 'bold' ? '24' : '16'}></line>
                    <path
                        d="M154.9,157.6A39.6,39.6,0,0,1,128,168a40,40,0,0,1-26.9-69.6"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={weight === 'bold' ? '24' : '16'}></path>
                    <path
                        d="M74,68.6C33.2,89.2,16,128,16,128s32,72,112,72a117.9,117.9,0,0,0,54-12.6"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={weight === 'bold' ? '24' : '16'}></path>
                    <path
                        d="M208.6,169.1C230.4,149.6,240,128,240,128S208,56,128,56a123.9,123.9,0,0,0-20.7,1.7"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={weight === 'bold' ? '24' : '16'}></path>
                    <path
                        d="M135.5,88.7a39.9,39.9,0,0,1,32.3,35.5"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={weight === 'bold' ? '24' : '16'}></path>
                </svg>
            )}
        </>
    );
}
