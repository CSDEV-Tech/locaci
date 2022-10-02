import { X } from 'phosphor-react';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { clsx } from '../../lib/functions';
import { useOnClickOutside } from '../../lib/hooks';
import { Button } from '../atoms/button';

export type SideNavProps = {
    children?: React.ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
    className?: string;
};

export function SideNav({
    children,
    onClose,
    className,
    isOpen = false
}: SideNavProps) {
    const ref = React.useRef<HTMLElement>(null);
    const cancelButtonRef = React.useRef<HTMLButtonElement>(null);

    useOnClickOutside(ref, () => onClose?.());
    React.useEffect(() => {
        if (isOpen) {
            cancelButtonRef.current?.focus();
        }

        // Hide all elements from screen readers
        const elementsToHide = document.querySelectorAll(`main,header,footer`);
        for (let i = 0; i < elementsToHide.length; i++) {
            const element = elementsToHide[i];
            if (isOpen) {
                element.setAttribute(`aria-hidden`, 'true');
                (element as HTMLElement).style.overflow = 'hidden';
            } else {
                element.removeAttribute('aria-hidden');
                (element as HTMLElement).style.removeProperty('overflow');
            }
        }
    }, [isOpen]);

    const id = React.useId();

    return isOpen ? (
        createPortal(
            <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-[998] bg-[rgba(43,39,40,0.6)] backdrop-blur-sm"></div>

                {/* content */}
                <nav
                    className={clsx(
                        className,
                        'fixed top-0 bottom-0 right-[20%] left-0',
                        'z-[999] bg-white',
                        'animate-translate-in',
                        'flex flex-col items-start gap-4'
                    )}
                    aria-describedby={id}
                    aria-expanded={true}
                    ref={ref}>
                    <Button
                        square
                        variant="hollow"
                        ref={cancelButtonRef}
                        onClick={onClose}
                        className="mr-4 mt-4 self-end"
                        renderLeadingIcon={cls => <X className={cls} />}
                    />
                    <div className="sr-only" id={id}>
                        Menu principal
                    </div>
                    <div className="h-full w-full">{children}</div>
                </nav>
            </>,
            document.body
        )
    ) : (
        <></>
    );
}
