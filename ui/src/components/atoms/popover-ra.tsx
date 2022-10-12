import * as React from 'react';
import { useOverlay, DismissButton, FocusScope } from 'react-aria';
import { clsx } from '../../lib/functions';

interface PopoverProps {
    popoverRef?: React.RefObject<HTMLDivElement>;
    children: React.ReactNode;
    isOpen?: boolean;
    onClose: () => void;
    className?: string;
    overflowRight?: boolean;
    overflowLeft?: boolean;
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
                    props.className,
                    'flex flex-col rounded-md bg-white py-3 shadow-card',
                    'absolute top-[calc(100%+0.5rem)] z-10',
                    {
                        'left-0': !props.overflowLeft,
                        'right-0': !props.overflowRight
                    }
                )}>
                {children}
                <DismissButton onDismiss={onClose} />
            </div>
        </FocusScope>
    );
}
