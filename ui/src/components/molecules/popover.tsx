import * as React from 'react';
import { Popover as HeadlessUIPopover, Transition } from '@headlessui/react';
import { clsx } from '../../lib/functions';

export type PopoverProps = {
    children?: React.ReactNode;
    className?: string;
    button?: (open: boolean) => React.ReactNode;
    alignInline?: 'left' | 'right';
    alignBlock?: 'top' | 'bottom';
};

export function Popover({
    children,
    className,
    button,
    alignInline = 'left',
    alignBlock = 'bottom'
}: PopoverProps) {
    return (
        <HeadlessUIPopover className={clsx(className, 'relative inline-block')}>
            {({ open }) => (
                <>
                    <HeadlessUIPopover.Button>
                        {({ open }) => <>{button?.(open)}</>}
                    </HeadlessUIPopover.Button>

                    <Transition
                        show={open}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1">
                        <HeadlessUIPopover.Panel
                            className={clsx(
                                'absolute z-40 rounded-md bg-white p-4 shadow-md',
                                {
                                    'left-0': alignInline === 'left',
                                    'right-0': alignInline === 'right',
                                    'top-[calc(100%+.2rem)]':
                                        alignBlock === 'bottom',
                                    'bottom-[3rem]': alignBlock === 'top'
                                }
                            )}
                            static>
                            {children}
                        </HeadlessUIPopover.Panel>
                    </Transition>
                </>
            )}
        </HeadlessUIPopover>
    );
}
