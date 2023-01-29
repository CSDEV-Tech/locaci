import * as React from 'react';
import { clsx } from '../../lib/functions';

export type MapPinProps = {
    className?: string;
    children?: React.ReactNode;
    id?: string;
};

export const MapPin = React.forwardRef<HTMLDivElement, MapPinProps>(
    ({ children, className, id }, ref) => {
        return (
            <div
                id={id}
                ref={ref}
                className={clsx(
                    className,
                    'relative h-5 w-5 rounded-full bg-white',
                    'flex items-center justify-center',
                    'after:h-4 after:w-4 after:rounded-full after:bg-primary'
                )}>
                <div className="absolute bottom-[calc(100%+.5rem)]">
                    {children}
                </div>
            </div>
        );
    }
);
