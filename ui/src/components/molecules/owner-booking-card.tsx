import * as React from 'react';
import { clsx, formatDateToFrenchDate } from '../../lib/functions';
import { Avatar } from '../atoms/avatar';
import { Button } from '../atoms/button';
import { Card } from '../atoms/card';
import { CalendarBlankIcon } from '../atoms/icons/calendar-blank';
import { EyeIcon } from '../atoms/icons/eye';
import { Tag } from '../atoms/tag';
import { CustomImageComponentType } from './dashboard-property-card';

export type OwnerBookingCardProps = {
    title: string;
    coverURL: string;
    className?: string;
    applicantAvatarURL?: string | null;
    customImage?: CustomImageComponentType;
    dateOfReservation: Date;
    applicantName: string;
    onShowMore: () => void;
};

export function OwnerBookingCard({
    title,
    coverURL,
    dateOfReservation,
    customImage,
    onShowMore,
    className,
    applicantAvatarURL,
    applicantName
}: OwnerBookingCardProps) {
    const Img = customImage ?? 'img';

    return (
        <Card
            className={clsx(
                className,
                'relative inline-flex flex-col items-start gap-4',
                'relative w-full !bg-transparent !shadow-none'
            )}>
            <Button
                square
                variant={`dark`}
                className={clsx('absolute top-4 right-4 z-30')}
                onClick={onShowMore}
                renderTrailingIcon={cls => <EyeIcon className={cls} />}>
                Voir fiche
            </Button>

            <div
                className={clsx(
                    'flex flex-shrink-0 items-center justify-center rounded-lg bg-gray/20',
                    'h-[150px] w-full md:h-[200px]'
                )}>
                <Img
                    width={383}
                    height={150}
                    alt={title}
                    src={coverURL}
                    className={clsx(
                        'h-full w-full rounded-lg object-cover object-center'
                    )}
                />
            </div>

            <h3 className="text-lg font-semibold text-dark">{title}</h3>

            <div className="flex w-full items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Tag isSquared>
                        <CalendarBlankIcon
                            weight="bold"
                            aria-label="Date de réservation :"
                            className="h-6 w-6 flex-shrink-0"
                        />
                    </Tag>

                    <strong className="font-medium">
                        <time dateTime={dateOfReservation.toISOString()}>
                            {formatDateToFrenchDate(dateOfReservation)}
                        </time>
                    </strong>
                </div>

                <div>
                    <Avatar
                        name={applicantName}
                        src={applicantAvatarURL}
                        className={`bg-gray`}
                    />
                </div>
            </div>
        </Card>
    );
}
