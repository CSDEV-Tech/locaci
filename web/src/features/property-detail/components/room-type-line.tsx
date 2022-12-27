// components
import { BedIcon } from '@locaci/ui/components/atoms/icons/bed';
import { CookingPotIcon } from '@locaci/ui/components/atoms/icons/cooking-pot';
import { ArmchairIcon } from '@locaci/ui/components/atoms/icons/armchair';
import { BathtubIcon } from '@locaci/ui/components/atoms/icons/bathtub';
import { CarIcon } from '@locaci/ui/components/atoms/icons/car';
import { DropIcon } from '@locaci/ui/components/atoms/icons/drop';
import { ForkKnifeIcon } from '@locaci/ui/components/atoms/icons/fork-knife';
import { LadderIcon } from '@locaci/ui/components/atoms/icons/ladder';
import { StorefrontIcon } from '@locaci/ui/components/atoms/icons/storefront';
import { ToiletIcon } from '@locaci/ui/components/atoms/icons/toilet';
import { UmbrellaIcon } from '@locaci/ui/components/atoms/icons/umbrella';
import { WindowIcon } from '@locaci/ui/components/atoms/icons/window';
import { HouseIcon } from '@locaci/ui/components/atoms/icons/house';
import { Tag } from '@locaci/ui/components/atoms/tag';

// utils
import { clsx } from '@locaci/ui/lib/functions';

// types
import { type RoomType, RoomTypes } from '~/features/shared/types';
export type RoomTypeLineProps = {
    type: RoomType;
    count: number;
};

export function RoomTypeLine(props: RoomTypeLineProps) {
    const elements: Record<RoomType, React.FC> = {
        BEDROOM: () => (
            <BedIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        ),
        KITCHEN: () => (
            <CookingPotIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        ),
        LIVING_ROOM: () => (
            <ArmchairIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        ),
        BATHROOM: () => (
            <BathtubIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        ),
        DINING_ROOM: () => (
            <ForkKnifeIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        ),
        ATTIC: () => (
            <HouseIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        ),
        BASEMENT: () => (
            <LadderIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        ),
        GARAGE: () => <CarIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />,
        BALCONY: () => (
            <WindowIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        ),
        VERANDA: () => (
            <StorefrontIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        ),
        TERRACE: () => (
            <UmbrellaIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        ),
        LAUNDRY: () => (
            <DropIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        ),
        TOILET: () => (
            <ToiletIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        )
    };
    const DisplayElement = elements[props.type];

    return (
        <div className={`flex items-center gap-4`}>
            <Tag isSquared>
                <DisplayElement />
            </Tag>
            <span className={`font-semibold`}>
                {props.count}&nbsp;
                {RoomTypes[props.type]}
                {props.count > 1 ? 's' : ''}
            </span>
        </div>
    );
}
