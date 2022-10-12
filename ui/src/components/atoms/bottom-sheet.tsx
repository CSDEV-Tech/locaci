import * as React from 'react';
import {
    BottomSheet as ReactSpringBottomSheet,
    BottomSheetProps as ReactSpringBottomSheetProps,
    BottomSheetRef
} from 'react-spring-bottom-sheet';

import { clsx } from '../../lib/functions';

export type BottomSheetProps = {
    className?: string;
    children?:
        | React.ReactNode
        | ((
              sheetRef: React.RefObject<BottomSheetRef>,
              dismiss?: () => void
          ) => React.ReactNode);
} & ReactSpringBottomSheetProps;

export function BottomSheet({
    className,
    children,
    open = true,
    ...props
}: BottomSheetProps) {
    const sheetRef = React.useRef<BottomSheetRef>(null);
    return (
        <div>
            <ReactSpringBottomSheet
                open={open}
                ref={sheetRef}
                className={clsx(className)}
                {...props}>
                {typeof children === 'function'
                    ? children(sheetRef, props.onDismiss)
                    : children}
            </ReactSpringBottomSheet>
        </div>
    );
}

export default BottomSheet;
