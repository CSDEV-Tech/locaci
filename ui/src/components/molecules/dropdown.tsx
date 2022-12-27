import * as React from 'react';
import { LinkProps, Link } from '../atoms/link';
import { clsx } from '../../lib/functions';
import { Menu, Transition } from '@headlessui/react';

export type DropdownLink = {
    id?: string;
    text: string;
    Icon: React.ComponentType<{ className?: string; active: boolean }>;
    href: string;
    external?: boolean;
    clsx?: (state: { active: boolean }) => string;
};

export type DropdownButton = {
    id?: string;
    text: string;
    Icon: React.ComponentType<{ className?: string; active: boolean }>;
    onClick: () => void;
    clsx?: (state: { active: boolean }) => string;
};

export type DropdownItem = DropdownLink | DropdownButton;

export interface DropdownProps {
    items: DropdownItem[];
    button: (options: { open: boolean }) => React.ReactElement;
    className?: string;
    itemsClassName?: string;
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
    customLink,
    itemsClassName = ''
}: DropdownProps) => {
    return (
        <Menu as="div" className={clsx(`relative`, className)}>
            {({ open }) => (
                <>
                    <Menu.Button as={React.Fragment}>
                        {button({ open })}
                    </Menu.Button>

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
                                itemsClassName,
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
                                                        item.clsx?.({ active }),
                                                        `flex w-full min-w-max flex-1 items-center gap-2`,
                                                        `cursor-pointer rounded-md py-2 px-2 font-medium`,
                                                        {
                                                            'bg-primary text-white':
                                                                active
                                                        }
                                                    )}
                                                    onClick={item.onClick}>
                                                    <div>
                                                        <item.Icon
                                                            className="icon"
                                                            active={active}
                                                        />
                                                    </div>
                                                    <span className="whitespace-nowrap">
                                                        {item.text}
                                                    </span>
                                                </button>
                                            );
                                        } else {
                                            return (
                                                <Link
                                                    Custom={
                                                        !item.external
                                                            ? customLink
                                                            : undefined
                                                    }
                                                    target={
                                                        item.external
                                                            ? '_blank'
                                                            : '_self'
                                                    }
                                                    href={`${item.href}`}
                                                    className={clsx(
                                                        item.clsx?.({ active }),
                                                        `flex w-full min-w-max flex-1 items-center gap-2`,
                                                        `cursor-pointer rounded-md py-2 px-2 font-medium`,
                                                        {
                                                            'bg-primary text-white':
                                                                active
                                                        }
                                                    )}>
                                                    <div>
                                                        <item.Icon
                                                            className="icon"
                                                            active={active}
                                                        />
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
