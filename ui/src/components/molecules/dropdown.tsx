import * as React from 'react';
import { LinkProps, Link } from '../atoms/link';
import { clsx } from '../../lib/functions';
import { Menu, Transition } from '@headlessui/react';

export type DropdownLink = {
    id?: string;
    text: string;
    Icon: React.ComponentType<{ className?: string }>;
    href: string;
};

export type DropdownButton = {
    id?: string;
    text: string;
    Icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
};

export type DropdownItem = DropdownLink | DropdownButton;

export interface DropdownProps {
    items: DropdownItem[];
    button: () => React.ReactElement;
    className?: string;
    align?: 'left' | 'right';
    customLink?: LinkProps[`Custom`];
}

function isDropDownButton(item: DropdownItem): item is DropdownButton {
    return (item as DropdownButton).onClick !== undefined;
}

export const Dropdown = ({
    items = [],
    className = '',
    button,
    align = 'right',
    customLink
}: DropdownProps) => {
    return (
        <Menu as="div" className={clsx(`relative`, className)}>
            {({ open }) => (
                <>
                    <Menu.Button as={React.Fragment}>{button}</Menu.Button>

                    <Transition
                        show={open}
                        as={React.Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95">
                        <Menu.Items
                            static
                            className={clsx(
                                `absolute mt-2 flex flex-col items-start gap-1 rounded-md p-2`,
                                `bg-white shadow-md focus:outline-none`,
                                {
                                    'right-0': align === 'right',
                                    'left-0': align === 'left'
                                }
                            )}
                            as="div">
                            {items.map((item, index) => (
                                <Menu.Item key={index}>
                                    {({ active }) => {
                                        if (isDropDownButton(item)) {
                                            return (
                                                <button
                                                    className={clsx(
                                                        `flex w-full min-w-max flex-1 items-center gap-2`,
                                                        `cursor-pointer rounded-md py-2 px-2 font-medium`,
                                                        {
                                                            'bg-primary text-white':
                                                                active
                                                        }
                                                    )}
                                                    onClick={item.onClick}>
                                                    <div>
                                                        <item.Icon className="icon" />
                                                    </div>
                                                    <span className="whitespace-nowrap">
                                                        {item.text}
                                                    </span>
                                                </button>
                                            );
                                        } else {
                                            return (
                                                <Link
                                                    Custom={customLink}
                                                    href={`${item.href}`}
                                                    className={clsx(
                                                        `flex w-full min-w-max flex-1 items-center gap-2`,
                                                        `cursor-pointer rounded-md py-2 px-2 font-medium`,
                                                        {
                                                            'bg-primary text-white':
                                                                active
                                                        }
                                                    )}>
                                                    <div>
                                                        <item.Icon className="icon" />
                                                    </div>
                                                    <span className="whitespace-nowrap">
                                                        {item.text}
                                                    </span>
                                                </Link>
                                            );
                                        }
                                    }}
                                </Menu.Item>
                            ))}
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
};
