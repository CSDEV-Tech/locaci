import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    BottomSheet,
    BottomSheetProps
} from '../../components/atoms/bottom-sheet';
import { Button } from '../../components/atoms/button';
import { XIcon } from '../../components/atoms/icons/x';

export default {
    title: 'Composants/Atoms/BottomSheet',
    component: BottomSheet
} as ComponentMeta<typeof BottomSheet>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof BottomSheet> = args => (
    <>
        <BottomSheet {...args} />
    </>
);

export const Default: ComponentStory<typeof BottomSheet> = args => {
    const [isOpen, setIsOpen] = React.useState(args.open ?? true);
    return (
        <>
            <Button variant="primary" onClick={() => setIsOpen(true)}>
                Open BottomSheet
            </Button>
            <BottomSheet
                {...args}
                open={isOpen}
                onDismiss={() => setIsOpen(false)}
            />
        </>
    );
};

Default.args = {
    onDismiss: undefined,
    blocking: false,
    defaultSnap: ({ maxHeight }) => maxHeight / 2,
    snapPoints: ({ maxHeight }) => [maxHeight, maxHeight / 2, maxHeight / 4],
    children: (sheetRef, dismiss) => (
        <>
            <div className="flex w-full flex-col justify-between gap-2 p-4 md:flex-row">
                <Button
                    variant="primary"
                    onClick={() => {
                        sheetRef.current?.snapTo(({ maxHeight }) => maxHeight);
                    }}>
                    Snap to max
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        sheetRef.current?.snapTo(
                            ({ maxHeight }) => maxHeight / 2
                        );
                    }}>
                    Snap to middle
                </Button>
                <Button
                    variant="dark"
                    onClick={() => {
                        sheetRef.current?.snapTo(({ minHeight }) => minHeight);
                    }}>
                    Snap to min
                </Button>
                <Button
                    variant="hollow"
                    onClick={() => {
                        dismiss?.();
                    }}
                    renderTrailingIcon={cls => <XIcon className={cls} />}>
                    Close
                </Button>
            </div>
            <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Impedit ex vero reiciendis laborum, iure aut est fugit quibusdam
                asperiores voluptate illo recusandae officiis ipsam sunt. Dicta
                vitae eos eius officia?
            </p>
            <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Impedit ex vero reiciendis laborum, iure aut est fugit quibusdam
                asperiores voluptate illo recusandae officiis ipsam sunt. Dicta
                vitae eos eius officia?
            </p>
            <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Impedit ex vero reiciendis laborum, iure aut est fugit quibusdam
                asperiores voluptate illo recusandae officiis ipsam sunt. Dicta
                vitae eos eius officia?
            </p>
            <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Impedit ex vero reiciendis laborum, iure aut est fugit quibusdam
                asperiores voluptate illo recusandae officiis ipsam sunt. Dicta
                vitae eos eius officia?
            </p>
        </>
    )
} as BottomSheetProps;
