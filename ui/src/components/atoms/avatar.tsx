import * as React from 'react';
import { clsx } from '../../lib/functions';

export type AvatarProps = {
    src: string;
    name: string;
    className?: string;
};

export function Avatar({ src, name, className }: AvatarProps) {
    return (
        <div className={clsx(className, 'h-10 w-10 rounded-md')}>
            <img
                src={src}
                alt={`Image de profil de ${name}`}
                className={'h-10 w-10 object-cover object-center rounded-md'}
            />
        </div>
    );
}
