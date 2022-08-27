import * as React from 'react';

import { clsx } from '../../lib/functions';

type RenderFunction = (className: string) => React.ReactNode;

export type InputGroupProps = {
    children: RenderFunction | Array<RenderFunction>;
    className?: string;
};

export function InputGroup({ children, className }: InputGroupProps) {
    return (
        <div className={clsx(className, 'flex items-center rounded-md')}>
            {Array.isArray(children) ? (
                children.map((child, index) => {
                    return child(
                        clsx('w-full', {
                            'rounded-l-none': index > 0,
                            'rounded-r-none': index < children.length - 1
                        })
                    );
                })
            ) : (
                <>{children('')}</>
            )}
        </div>
    );
}
