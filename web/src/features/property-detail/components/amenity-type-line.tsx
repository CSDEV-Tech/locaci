// components
import { WifiIcon } from '@locaci/ui/components/atoms/icons/wifi';
import { SnowflakeIcon } from '@locaci/ui/components/atoms/icons/snowflake';
import { TvIcon } from '@locaci/ui/components/atoms/icons/tv';
import { DesktopIcon } from '@locaci/ui/components/atoms/icons/dekstop';
import { DryerMachineIcon } from '@locaci/ui/components/atoms/icons/dryer-machine';
import { WashingMachineIcon } from '@locaci/ui/components/atoms/icons/washing-machine';
import { ThermometerHotIcon } from '@locaci/ui/components/atoms/icons/thermometer-hot';
import { DropHotIcon } from '@locaci/ui/components/atoms/icons/drop-hot';
import { MicrowaveIcon } from '@locaci/ui/components/atoms/icons/microwave';
import { OvenIcon } from '@locaci/ui/components/atoms/icons/oven';
import { RefregiratorIcon } from '@locaci/ui/components/atoms/icons/refregirator';
import { HorizontalDotsIcon } from '@locaci/ui/components/atoms/icons/dots-horizontal';
import { Tag } from '@locaci/ui/components/atoms/tag';

// types
import { type AmenityType, AmenityTypes } from '~/features/shared/types';
export type AmenityTypeLineProps = {
    type: AmenityType;
    name?: string | null;
};

export function AmenityTypeLine(props: AmenityTypeLineProps) {
    const elements: Record<AmenityType, React.FC> = {
        WIFI: () => <WifiIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />,
        AIR_CONDITIONNER: () => (
            <SnowflakeIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        ),
        CABLE: () => <TvIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />,
        DESKTOP: () => (
            <DesktopIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        ),
        DRYER_MACHINE: () => (
            <DryerMachineIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        ),
        WASHING_MACHINE: () => (
            <WashingMachineIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        ),
        HEATING: () => (
            <ThermometerHotIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        ),
        HOT_WATER: () => (
            <DropHotIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        ),
        MICROWAVE: () => (
            <MicrowaveIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        ),
        OTHER: () => (
            <HorizontalDotsIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        ),
        OVEN: () => <OvenIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />,
        REFREGIRATOR: () => (
            <RefregiratorIcon className={`h-6 w-6 flex-shrink-0 text-gray`} />
        )
    };
    const DisplayElement = elements[props.type];

    return (
        <div className={`inline-flex items-center gap-4`}>
            <Tag isSquared>
                <DisplayElement />
            </Tag>
            <span className={`font-semibold`}>
                {props.type === 'OTHER' ? props.name : AmenityTypes[props.type]}
            </span>
        </div>
    );
}
