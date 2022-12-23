import * as React from 'react';
// components
import { CaretLeftIcon } from '../../components/atoms/icons/caret-left';
import { CaretRightIcon } from '../../components/atoms/icons/caret-right';
import { CaretUpIcon } from '../../components/atoms/icons/caret-up';
import { CaretDownIcon } from '../../components/atoms/icons/caret-down';
import { CheckIcon } from '../../components/atoms/icons/check';
import { MinusCircleIcon } from '../../components/atoms/icons/minus-circle';
import { PlusCircleIcon } from '../../components/atoms/icons/plus-circle';
import { XCircleIcon } from '../../components/atoms/icons/x-circle';
import { XIcon } from '../../components/atoms/icons/x';
import { CheckCircleIcon } from '../../components/atoms/icons/check-circle';
import { MagnifyIngGlassIcon } from '../../components/atoms/icons/magnifying-glass';
import { CalendarBlankIcon } from '../../components/atoms/icons/calendar-blank';
import { FacebookLogoIcon } from '../../components/atoms/icons/facebook-logo';
import { LinkedinLogoIcon } from '../../components/atoms/icons/linkedin-logo';
import { ArrowLeftIcon } from '../../components/atoms/icons/arrow-left';
import { ArrowRightIcon } from '../../components/atoms/icons/arrow-right';
import { UploadSimpleIcon } from '../../components/atoms/icons/upload-simple';
import { FileImageIcon } from '../../components/atoms/icons/file-image';
import { FilePdfIcon } from '../../components/atoms/icons/file-pdf';
import { WarningCircleIcon } from '../../components/atoms/icons/warning-circle';
import { EyeIcon } from '../../components/atoms/icons/eye';
import { ImageIcon } from '../../components/atoms/icons/image';
import { TrashIcon } from '../../components/atoms/icons/trash';
import { BedIcon } from '../../components/atoms/icons/bed';
import { RulerIcon } from '../../components/atoms/icons/ruler';
import { MapPinIcon } from '../../components/atoms/icons/map-pin';
import { RefreshIcon } from '../../components/atoms/icons/refresh';
import { HorizontalDotsIcon } from '../../components/atoms/icons/horizontal-dots';
import { QuotesIcon } from '../../components/atoms/icons/quotes';
import { HouseIcon } from '../../components/atoms/icons/house';

// types
import type {
    IconComponent,
    IconProps
} from '../../components/atoms/icons/types';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

const DummyIcon = (props: IconProps) => <></>;

export default {
    title: 'Composants/Atoms/Icons',
    component: DummyIcon
} as ComponentMeta<IconComponent>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<IconComponent> = args => (
    <div className="grid  grid-cols-2 gap-4 text-white sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <div className="flex flex-col items-center gap-2">
            <CaretLeftIcon className="h-10 w-10" />
            <span>CaretLeftIcon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <CaretRightIcon className="h-10 w-10 " />
            <span>CaretRightIcon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <CaretUpIcon className="h-10 w-10" />
            <span>CaretUpIcon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <CaretDownIcon className="h-10 w-10 " />
            <span>CaretDownIcon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <CheckIcon className="h-10 w-10 " />
            <span>CheckIcon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <MinusCircleIcon className="h-10 w-10 " />
            <span>MinusCircleIcon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <PlusCircleIcon className="h-10 w-10 " />
            <span>PlusCircleIcon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <XIcon className="h-10 w-10 " />
            <span>XIcon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <XCircleIcon className="h-10 w-10 " />
            <span>XCircleIcon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <XCircleIcon weight="fill" className="h-10 w-10 " />
            <span>XCircleIcon (fill)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <CheckCircleIcon className="h-10 w-10 " />
            <span>CheckCircleIcon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <CheckCircleIcon weight="fill" className="h-10 w-10 " />
            <span>CheckCircleIcon (filled) </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <MagnifyIngGlassIcon className="h-10 w-10 " />
            <span>MagnifyIngGlassIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <CalendarBlankIcon className="h-10 w-10 " />
            <span>CalendarBlankIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <FacebookLogoIcon className="h-10 w-10 " />
            <span>FacebookLogoIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <LinkedinLogoIcon className="h-10 w-10 " />
            <span>LinkedinLogoIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <ArrowLeftIcon className="h-10 w-10 " />
            <span>ArrowLeftIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <ArrowRightIcon className="h-10 w-10 " />
            <span>ArrowRightIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <UploadSimpleIcon className="h-10 w-10 " />
            <span>UploadSimpleIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <FileImageIcon className="h-10 w-10 " />
            <span>FileImageIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <FilePdfIcon className="h-10 w-10 " />
            <span>FilePdfIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <WarningCircleIcon className="h-10 w-10 " />
            <span>WarningCircleIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <EyeIcon className="h-10 w-10 " />
            <span>EyeIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <ImageIcon className="h-10 w-10 " />
            <span>ImageIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <TrashIcon className="h-10 w-10 " />
            <span>TrashIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <TrashIcon weight="fill" className="h-10 w-10 " />
            <span>TrashIcon (filled) </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <BedIcon className="h-10 w-10 " />
            <span>BedIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <RulerIcon className="h-10 w-10 " />
            <span>RulerIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <MapPinIcon className="h-10 w-10 " />
            <span>MapPinIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <RefreshIcon className="h-10 w-10 " />
            <span>RefreshIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <HorizontalDotsIcon className="h-10 w-10 " />
            <span>HorizontalDotsIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <QuotesIcon className="h-10 w-10 " />
            <span>QuotesIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <QuotesIcon className="h-10 w-10" weight="fill" />
            <span>QuotesIcon (fill)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <HouseIcon className="h-10 w-10" />
            <span>HouseIcon </span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <HouseIcon className="h-10 w-10" weight="fill" />
            <span>HouseIcon (fill)</span>
        </div>
    </div>
);

export const List = Template.bind({});
List.args = {} as IconProps;
