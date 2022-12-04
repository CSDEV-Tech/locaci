import * as React from 'react';
// components
import {
    Armchair,
    Bathtub,
    Bed,
    Car,
    CookingPot,
    Drop,
    ForkKnife,
    HouseSimple,
    LadderSimple,
    MinusCircle,
    PlusCircle,
    SquaresFour,
    Storefront,
    Toilet,
    Trash,
    UmbrellaSimple
} from 'phosphor-react';
import { Button } from '@locaci/ui/components/atoms/button';

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
                <Bed
                    className={`h-6 w-6 flex-shrink-0 text-gray`}
                    weight={`duotone`}
                />
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
                <CookingPot
                    className={`h-6 w-6 flex-shrink-0 text-gray`}
                    weight={`duotone`}
                />
                <span className={`font-semibold`}>{RoomTypes['KITCHEN']}</span>
            </div>
        ),
        LIVING_ROOM: () => (
            <div className={`flex items-center gap-4`}>
                <Armchair
                    className={`h-6 w-6 flex-shrink-0 text-gray`}
                    weight={`duotone`}
                />
                <span className={`font-semibold`}>
                    {RoomTypes['LIVING_ROOM']}
                </span>
            </div>
        ),
        BATHROOM: () => (
            <div className={`flex items-center gap-4`}>
                <Bathtub
                    className={`h-6 w-6 flex-shrink-0 text-gray`}
                    weight={`duotone`}
                />
                <span className={`font-semibold`}>{RoomTypes['BATHROOM']}</span>
            </div>
        ),
        DINING_ROOM: () => (
            <div className={`flex items-center gap-4`}>
                <ForkKnife
                    className={`h-6 w-6 flex-shrink-0 text-gray`}
                    weight={`duotone`}
                />
                <span className={`font-semibold`}>
                    {RoomTypes['DINING_ROOM']}
                </span>
            </div>
        ),
        ATTIC: () => (
            <div className={`flex items-center gap-4`}>
                <HouseSimple className={`h-6 w-6 flex-shrink-0 text-gray`} />
                <span className={`font-semibold`}>{RoomTypes['ATTIC']}</span>
            </div>
        ),
        BASEMENT: () => (
            <div className={`flex items-center gap-4`}>
                <LadderSimple
                    className={`h-6 w-6 flex-shrink-0 text-gray`}
                    weight={`duotone`}
                />
                <span className={`font-semibold`}>{RoomTypes['BASEMENT']}</span>
            </div>
        ),
        GARAGE: () => (
            <div className={`flex items-center gap-4`}>
                <Car
                    className={`h-6 w-6 flex-shrink-0 text-gray`}
                    weight={`duotone`}
                />
                <span className={`font-semibold`}>{RoomTypes['GARAGE']}</span>
            </div>
        ),
        BALCONY: () => (
            <div className={`flex items-center gap-4`}>
                <SquaresFour
                    className={`h-6 w-6 flex-shrink-0 text-gray`}
                    weight={`duotone`}
                />
                <span className={`font-semibold`}>{RoomTypes['BALCONY']}</span>
            </div>
        ),
        VERANDA: () => (
            <div className={`flex items-center gap-4`}>
                <Storefront
                    className={`h-6 w-6 flex-shrink-0 text-gray`}
                    weight={`duotone`}
                />
                <span className={`font-semibold`}>{RoomTypes['VERANDA']}</span>
            </div>
        ),
        TERRACE: () => (
            <div className={`flex items-center gap-4`}>
                <UmbrellaSimple
                    className={`h-6 w-6 flex-shrink-0 text-gray`}
                    weight={`duotone`}
                />
                <span className={`font-semibold`}>{RoomTypes['TERRACE']}</span>
            </div>
        ),
        LAUNDRY: () => (
            <div className={`flex items-center gap-4`}>
                <Drop
                    className={`h-6 w-6 flex-shrink-0 text-gray`}
                    weight={`duotone`}
                />
                <span className={`font-semibold`}>{RoomTypes['LAUNDRY']}</span>
            </div>
        ),
        TOILET: () => (
            <div className={`flex items-center gap-4`}>
                <Toilet
                    className={`h-6 w-6 flex-shrink-0 text-gray`}
                    weight={`duotone`}
                />
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
                    renderTrailingIcon={cls => <MinusCircle className={cls} />}
                />
                <span className="font-bold">{props.count}</span>
                <Button
                    type={`button`}
                    onClick={props.onIncrease}
                    aria-label={`Augmenter`}
                    renderTrailingIcon={cls => <PlusCircle className={cls} />}
                />

                {typeof props.onDelete === 'function' && (
                    <Button
                        type={`button`}
                        variant={`danger`}
                        onClick={props.onDelete}
                        renderTrailingIcon={cls => <Trash className={cls} />}>
                        Retirer
                    </Button>
                )}
            </div>
        </div>
    );
}
