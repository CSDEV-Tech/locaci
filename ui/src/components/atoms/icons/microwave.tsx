import * as React from 'react';
import { IconProps } from './types';

export function MicrowaveIcon({ ...props }: IconProps) {
    return (
        <>
            <svg
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                fill={`currentColor`}
                {...props}>
                <path d="M29 3a2 2 0 0 1 1.995 1.85L31 5v22a2 2 0 0 1-1.85 1.995L29 29H3a2 2 0 0 1-1.995-1.85L1 27V5a2 2 0 0 1 1.85-1.995L3 3zm0 2H3v22h26zm-6 2v18H5V7zm-2 2H7v14l3 .001a4.975 4.975 0 0 1-.992-2.721L9 20v-3h10v3a4.978 4.978 0 0 1-1 3.001L21 23zm-4 10h-6v1a3 3 0 0 0 2.65 2.98l.174.015L14 23a3 3 0 0 0 2.995-2.824L17 20zm9-8a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-4a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
            </svg>
        </>
    );
}
