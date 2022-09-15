import * as React from 'react';
import { Tab } from '@headlessui/react';
import { clsx } from '../../lib/functions';

export type TabsProps = {
    className?: string;
    children?: React.ReactNode;
};

export function Tabs({ className, children }: TabsProps) {
    return (
        <div className={clsx(className)}>
            <Tab.Group>{children}</Tab.Group>
        </div>
    );
}

Tabs.Header = function ({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Tab.List
            className={clsx(
                className,
                `flex w-full items-center overflow-hidden`,
                `rounded-md border border-gray/20 bg-gray/30`
            )}>
            {children}
        </Tab.List>
    );
};

Tabs.HeaderItem = function ({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Tab as={React.Fragment}>
            {({ selected }) => (
                <button
                    className={clsx(
                        className,
                        'w-full py-4 px-6 text-center font-semibold',
                        {
                            'bg-white': selected,
                            'text-gray': !selected
                        }
                    )}>
                    {children}
                </button>
            )}
        </Tab>
    );
};

Tabs.Body = function ({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Tab.Panels className={clsx(className, `w-full py-4`)}>
            {children}
        </Tab.Panels>
    );
};

Tabs.Item = function ({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Tab.Panel className={clsx(className, `w-full`)}>{children}</Tab.Panel>
    );
};
