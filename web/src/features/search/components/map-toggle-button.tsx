'use client';
import * as React from 'react';

// components
import { Button } from '@locaci/ui/components/atoms/button';
import { MapIcon } from '@locaci/ui/components/atoms/icons/map';

// utils
import { useFilterStore } from '~/lib/store';

export type MapToggleButtonProps = {
    className?: string;
};

export function MapToggleButton(props: MapToggleButtonProps) {
    const { view, toggleMap } = useFilterStore(state => ({
        view: state.view,
        toggleMap: state.toggleMap
    }));

    return (
        <Button
            className={props.className}
            variant="dark"
            onClick={toggleMap}
            renderTrailingIcon={cls => <MapIcon className={cls} />}>
            Vue Carte
        </Button>
    );
}
