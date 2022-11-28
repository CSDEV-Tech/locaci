'use client';
import * as React from 'react';
// components
import { Button } from '@locaci/ui/components/atoms/button';
import { Select } from '@locaci/ui/components/atoms/select';
import { clsx } from '@locaci/ui/lib/functions';
import { CaretDoubleLeft, CaretDoubleRight } from 'phosphor-react';
import { RoomTypeCard } from './room-type-card';

// utils
import { updatePropertyStep4Schema } from '~/validation/property-schema';
import { useZodForm } from '~/features/shared/hooks/use-zod-form';

// types
import type { z } from 'zod';
import { type RoomType, RoomTypes } from '~/features/shared/types';
export type Form5Values = Omit<
    z.TypeOf<typeof updatePropertyStep4Schema>,
    'uid'
>;

export type FormStep5Props = {
    onPreviousClick: () => void;
    onSubmit: (values: Form5Values) => void;
    defaultValues: Partial<Form5Values>;
    isSubmitting: boolean;
};

export function FormStep5(props: FormStep5Props) {
    const form = useZodForm({
        schema: updatePropertyStep4Schema.omit({
            uid: true
        }),
        defaultValues: {
            additionalRooms: props.defaultValues.additionalRooms ?? []
        }
    });

    const roomsAdded = form.watch('additionalRooms');

    const rooms = React.useMemo(() => {
        return roomsAdded.reduce((preVious, currentValue) => {
            const newTypeRooms = preVious;
            const typeRoom = newTypeRooms.find(
                r => r.type === currentValue.type
            );

            if (typeRoom) {
                typeRoom.count++;
            } else {
                newTypeRooms.push({
                    type: currentValue.type,
                    count: 1
                });
            }
            return newTypeRooms;
        }, [] as Array<{ type: RoomType; count: number }>);
    }, [roomsAdded]);

    const [roomTypeToAdd, setRoomTypeToAdd] =
        React.useState<RoomType>('BEDROOM');

    const noOfBedRooms = rooms.find(r => r.type === 'BEDROOM')?.count ?? 0;

    function addRoom(type: RoomType) {
        form.setValue('additionalRooms', [
            ...roomsAdded,
            {
                type
            }
        ]);
    }

    function removeRoom(type: RoomType) {
        const newRooms = [...roomsAdded];

        const elementIndex = newRooms.findIndex(rt => rt.type === type);
        if (elementIndex > -1) {
            newRooms.splice(elementIndex, 1);
        }

        form.setValue('additionalRooms', newRooms);
    }

    function deleteRoom(type: RoomType) {
        const newRooms = [...roomsAdded].filter(rt => rt.type !== type);

        form.setValue('additionalRooms', newRooms);
    }

    return (
        <>
            <div>
                <h2 className="text-center text-2xl font-bold text-secondary">
                    5/8
                </h2>
                <h1 className="px-6 text-center text-2xl font-bold leading-normal md:text-3xl">
                    Indiquer les pièces de votre logement
                </h1>
            </div>

            <form
                className="flex flex-col items-stretch gap-4 px-6 md:m-auto md:w-[450px]"
                onSubmit={form.handleSubmit(variables =>
                    props.onSubmit(variables)
                )}>
                <ul>
                    <li
                        className={clsx(
                            `border-b border-t border-lightgray py-4`
                        )}>
                        <RoomTypeCard
                            type={'BEDROOM'}
                            count={noOfBedRooms}
                            onIncrease={() => addRoom('BEDROOM')}
                            onDecrease={() => removeRoom('BEDROOM')}
                        />
                    </li>
                    {rooms
                        .filter(r => r.type !== 'BEDROOM')
                        .map(({ type, count }) => (
                            <li
                                key={type}
                                className={clsx(
                                    `border-b border-lightgray py-4`
                                )}>
                                <RoomTypeCard
                                    type={type}
                                    count={count}
                                    onIncrease={() => addRoom(type)}
                                    onDecrease={() => removeRoom(type)}
                                    onDelete={() => deleteRoom(type)}
                                />
                            </li>
                        ))}
                </ul>

                <div className="my-12 flex flex-col items-stretch gap-4">
                    <h2 className="text-left font-semibold text-dark">
                        Ajouter une nouvelle pièce
                    </h2>
                    <Select
                        options={Object.entries(RoomTypes).map(
                            ([key, value]) => ({
                                label: value,
                                value: key
                            })
                        )}
                        value={roomTypeToAdd ?? undefined}
                        onChange={v => setRoomTypeToAdd(v as RoomType)}
                        label={'Type de pièce'}
                        variant={`secondary`}
                    />
                    <Button
                        block
                        type={`button`}
                        variant={`hollow`}
                        onClick={() => roomTypeToAdd && addRoom(roomTypeToAdd)}>
                        Ajouter une pièce
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="hollow"
                        className="w-full"
                        onClick={props.onPreviousClick}
                        renderLeadingIcon={cls => (
                            <CaretDoubleLeft className={cls} />
                        )}>
                        Précédent
                    </Button>

                    <Button
                        type="submit"
                        variant="dark"
                        className="w-full"
                        loading={props.isSubmitting}
                        renderTrailingIcon={cls => (
                            <CaretDoubleRight className={cls} />
                        )}>
                        Suivant
                    </Button>
                </div>
            </form>
        </>
    );
}
