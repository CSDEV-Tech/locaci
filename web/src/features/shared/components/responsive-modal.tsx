import * as React from 'react';
import useMediaQuery from '~/features/shared/hooks/use-media-query';
import { LazyBottomSheet } from '~/features/shared/components/lazy-bottom-sheet';
import { LazyModal } from '~/features/shared/components/lazy-modal';

export type ResponsiveModalProps = {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    title: string;
    maxHeightRatio?: number;
    minHeightRatio?: number;
};

export function ResponsiveModal({
    children,
    isOpen,
    onClose,
    title,
    minHeightRatio,
    maxHeightRatio = 0.95
}: ResponsiveModalProps) {
    const canShowModal = useMediaQuery(`(min-width: 768px)`);
    const canShowBottomSheet = useMediaQuery(`(max-width: 767px)`);

    return (
        <>
            {canShowBottomSheet && (
                <LazyBottomSheet
                    open={isOpen}
                    expandOnContentDrag
                    title={title}
                    onDismiss={onClose}
                    snapPoints={({ maxHeight, minHeight }) => [
                        minHeightRatio ? maxHeight * maxHeightRatio : minHeight,
                        maxHeight * maxHeightRatio
                    ]}
                    className={`z-[100] md:hidden`}>
                    {children}
                </LazyBottomSheet>
            )}

            {canShowModal && (
                <LazyModal title={title} isOpen={isOpen} onClose={onClose}>
                    {children}
                </LazyModal>
            )}
        </>
    );
}
