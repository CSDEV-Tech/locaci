import * as React from 'react';
import { clsx, getInitials } from '../../lib/functions';

export type AvatarProps = {
    name: string;
    src?: string | null;
    className?: string;
    imgClassName?: string;
};

export function Avatar({ src, name, className, imgClassName }: AvatarProps) {
    return (
        <div
            className={clsx(
                className,
                'flex h-10 w-10 items-center justify-center rounded-md text-white'
            )}>
            {src ? (
                <img
                    src={src}
                    alt={`Image de profil de ${name}`}
                    className={clsx(
                        imgClassName,
                        'h-full w-full rounded-md object-cover object-center'
                    )}
                />
            ) : (
                <span>{getInitials(name)}</span>
            )}
        </div>
    );
}
