import * as React from 'react';
// components
import { Button } from '@locaci/ui/components/atoms/button';
import { CarIcon } from '@locaci/ui/components/atoms/icons/car';
import { ArmchairIcon } from '@locaci/ui/components/atoms/icons/armchair';
import { BedIcon } from '@locaci/ui/components/atoms/icons/bed';
import { CookingPotIcon } from '@locaci/ui/components/atoms/icons/cooking-pot';
import { BathtubIcon } from '@locaci/ui/components/atoms/icons/bathtub';
import { ForkKnifeIcon } from '@locaci/ui/components/atoms/icons/fork-knife';
import { HouseIcon } from '@locaci/ui/components/atoms/icons/house';
import { LadderIcon } from '@locaci/ui/components/atoms/icons/ladder';
import { SquareFourIcon } from '@locaci/ui/components/atoms/icons/square-four';
import { StorefrontIcon } from '@locaci/ui/components/atoms/icons/storefront';
import { UmbrellaIcon } from '@locaci/ui/components/atoms/icons/umbrella';
import { DropIcon } from '@locaci/ui/components/atoms/icons/drop';
import { ToiletIcon } from '@locaci/ui/components/atoms/icons/toilet';
import { PlusCircleIcon } from '@locaci/ui/components/atoms/icons/plus-circle';
import { MinusCircleIcon } from '@locaci/ui/components/atoms/icons/minus-circle';
import { TrashIcon } from '@locaci/ui/components/atoms/icons/trash';

// utils
import { clsx } from '@locaci/ui/lib/functions';

// types
import { type RoomType, RoomTypes } from '~/features/shared/types';

export type RoomTypeCardProps = {
    type: RoomType;
    count: number;
    onIncrease: () => void;
    onDecrease: () => void;
    onDelete?: () => void;
};

export function RoomTypeCard(props: RoomTypeCardProps) {
    const elements: Record<RoomType, React.FC> = {
        BEDROOM: () => (
            <div className={`flex items-center gap-4`}>
                <BedIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
                <span className={`font-semibold`}>
                    {RoomTypes['BEDROOM']}
                    <span
                        className={`font-semibold text-danger`}
                        aria-label={`requis`}>
                        *
                    </span>
                </span>
            </div>
        ),
        KITCHEN: () => (
            <div className={`flex items-center gap-4`}>
                <CookingPotIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
                <span className={`font-semibold`}>{RoomTypes['KITCHEN']}</span>
            </div>
        ),
        LIVING_ROOM: () => (
            <div className={`flex items-center gap-4`}>
                <ArmchairIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
                <span className={`font-semibold`}>
                    {RoomTypes['LIVING_ROOM']}
                </span>
            </div>
        ),
        BATHROOM: () => (
            <div className={`flex items-center gap-4`}>
                <BathtubIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
                <span className={`font-semibold`}>{RoomTypes['BATHROOM']}</span>
            </div>
        ),
        DINING_ROOM: () => (
            <div className={`flex items-center gap-4`}>
                <ForkKnifeIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
                <span className={`font-semibold`}>
                    {RoomTypes['DINING_ROOM']}
                </span>
            </div>
        ),
        ATTIC: () => (
            <div className={`flex items-center gap-4`}>
                <HouseIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
                <span className={`font-semibold`}>{RoomTypes['ATTIC']}</span>
            </div>
        ),
        BASEMENT: () => (
            <div className={`flex items-center gap-4`}>
                <LadderIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
                <span className={`font-semibold`}>{RoomTypes['BASEMENT']}</span>
            </div>
        ),
        GARAGE: () => (
            <div className={`flex items-center gap-4`}>
                <CarIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
                <span className={`font-semibold`}>{RoomTypes['GARAGE']}</span>
            </div>
        ),
        BALCONY: () => (
            <div className={`flex items-center gap-4`}>
                <SquareFourIcon
                    className={`h-6 w-6 flex-shrink-0 text-gray`}
                    weight={`fill`}
                />
                <span className={`font-semibold`}>{RoomTypes['BALCONY']}</span>
            </div>
        ),
        VERANDA: () => (
            <div className={`flex items-center gap-4`}>
                <StorefrontIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
                <span className={`font-semibold`}>{RoomTypes['VERANDA']}</span>
            </div>
        ),
        TERRACE: () => (
            <div className={`flex items-center gap-4`}>
                <UmbrellaIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
                <span className={`font-semibold`}>{RoomTypes['TERRACE']}</span>
            </div>
        ),
        LAUNDRY: () => (
            <div className={`flex items-center gap-4`}>
                <DropIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
                <span className={`font-semibold`}>{RoomTypes['LAUNDRY']}</span>
            </div>
        ),
        TOILET: () => (
            <div className={`flex items-center gap-4`}>
                <ToiletIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
                <span className={`font-semibold`}>{RoomTypes['TOILET']}</span>
            </div>
        )
    };
    const DisplayElement = elements[props.type];

    return (
        <div
            className={clsx(
                `flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-center`
            )}>
            <DisplayElement />
            <div className={`flex items-center gap-4`}>
                <Button
                    type={`button`}
                    aria-label={`Diminuer`}
                    onClick={props.count > 1 ? props.onDecrease : undefined}
                    disabled={!(props.count > 1)}
                    renderTrailingIcon={cls => (
                        <MinusCircleIcon className={cls} />
                    )}
                />
                <span className="font-bold">{props.count}</span>
                <Button
                    type={`button`}
                    onClick={props.onIncrease}
                    aria-label={`Augmenter`}
                    renderTrailingIcon={cls => (
                        <PlusCircleIcon className={cls} />
                    )}
                />

                {typeof props.onDelete === 'function' && (
                    <Button
                        type={`button`}
                        variant={`danger`}
                        onClick={props.onDelete}
                        renderTrailingIcon={cls => (
                            <TrashIcon className={cls} />
                        )}>
                        Retirer
                    </Button>
                )}
            </div>
        </div>
    );
}
