import * as React from 'react';
import { useOverlay, DismissButton, FocusScope } from 'react-aria';
import { clsx } from '../../lib/functions';

interface PopoverProps {
    popoverRef?: React.RefObject<HTMLDivElement>;
    children: React.ReactNode;
    isOpen?: boolean;
    onClose: () => void;
}

export function Popover(props: PopoverProps) {
    let ref = React.useRef<HTMLDivElement>(null);
    let { popoverRef = ref, isOpen, onClose, children } = props;

    // Handle events that should cause the popup to close,
    // e.g. blur, clicking outside, or pressing the escape key.
    let { overlayProps } = useOverlay(
        {
            isOpen,
            onClose,
            shouldCloseOnBlur: true,
            isDismissable: false
        },
        popoverRef
    );

    // Add a hidden <DismissButton> component at the end of the popover
    // to allow screen reader users to dismiss the popup easily.
    return (
        <FocusScope restoreFocus>
            <div
                {...overlayProps}
                ref={popoverRef}
                className={clsx(
                    'flex flex-col rounded-md bg-white py-3 shadow-card',
                    'absolute top-[calc(100%+0.5rem)] left-0 right-0 z-10',
                    'max-h-[300px] overflow-y-scroll'
                )}>
                {children}
                <DismissButton onDismiss={onClose} />
            </div>
        </FocusScope>
    );
}
