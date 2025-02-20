import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from './icons/x';
import * as React from 'react';
import { clsx } from '../../lib/functions';
import { Button } from './button';

export type ModalProps = {
    title: string;
    isOpen: boolean;
    onClose?: () => void;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    cancelButtonRef?: React.RefObject<HTMLButtonElement>;
    footerClassName?: string;
    className?: string;
};

export default function Modal({
    children,
    title,
    footer,
    onClose,
    cancelButtonRef,
    footerClassName,
    className,
    isOpen = false
}: ModalProps) {
    return (
        <>
            <Transition appear show={isOpen} as={React.Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[100]"
                    onClose={() => onClose?.()}
                    initialFocus={cancelButtonRef}>
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95">
                                <Dialog.Panel
                                    className={clsx(
                                        className,
                                        'w-full max-w-3xl transform',
                                        'rounded-2xl bg-white text-left align-middle shadow-xl transition-all'
                                    )}>
                                    <div className="relative flex items-center justify-center border-b border-lightgray py-4 px-6">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900">
                                            {title}
                                        </Dialog.Title>
                                        {onClose && (
                                            <Button
                                                variant="outline"
                                                className="absolute right-6"
                                                square
                                                onClick={onClose}
                                                renderLeadingIcon={cls => (
                                                    <XIcon className={cls} />
                                                )}
                                            />
                                        )}
                                    </div>
                                    <div className="max-h-[620px] overflow-y-scroll p-6">
                                        {children}
                                    </div>
                                    {footer && (
                                        <div
                                            className={clsx(
                                                footerClassName,
                                                'border-t border-lightgray py-4 px-6'
                                            )}>
                                            {footer}
                                        </div>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
