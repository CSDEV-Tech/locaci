import * as React from 'react';
// components
import { Button, clsx, Select } from '@locaci/ui';
import { CaretDoubleLeft, CaretDoubleRight } from 'phosphor-react';
import { RoomTypeCard } from '~/features/create-property';

// utils
import { createPropertyRequestSchema } from '~/server/trpc/validation/property-schema';
import { useZodForm } from '~/features/shared/hooks/use-zod-form';

// types
import type { z } from 'zod';
import { type RoomType, RoomTypes } from '~/features/shared/types';
export type Form5Values = Pick<
    z.TypeOf<typeof createPropertyRequestSchema>,
    'additionalRooms'
>;

export type FormStep5Props = {
    onPreviousClick: () => void;
    onSubmit: (values: Form5Values) => void;
    defaultValues: Partial<Form5Values>;
};

export function FormStep5(props: FormStep5Props) {
    const form = useZodForm({
        schema: createPropertyRequestSchema.pick({
            additionalRooms: true
        }),
        defaultValues: {
            additionalRooms: [],
            ...props.defaultValues
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

    function handleAddRoom(type: RoomType) {
        form.setValue('additionalRooms', [
            ...roomsAdded,
            {
                type
            }
        ]);
    }

    function handleRemoveRoom(type: RoomType) {
        const newRooms = [...roomsAdded];

        const elementIndex = newRooms.findIndex(rt => rt.type === type);
        if (elementIndex > -1) {
            newRooms.splice(elementIndex, 1);
        }

        form.setValue('additionalRooms', newRooms);
    }

    function handleDeleteRoom(type: RoomType) {
        const newRooms = [...roomsAdded].filter(rt => rt.type !== type);

        form.setValue('additionalRooms', newRooms);
    }

    return (
        <>
            <div>
                <h1 className="px-6 text-center text-2xl font-extrabold leading-normal md:text-3xl">
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
                            count={noOfBedRooms + 1}
                            onIncrease={() => handleAddRoom('BEDROOM')}
                            onDecrease={() => handleRemoveRoom('BEDROOM')}
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
                                    onIncrease={() => handleAddRoom(type)}
                                    onDecrease={() => handleRemoveRoom(type)}
                                    onDelete={() => handleDeleteRoom(type)}
                                />
                            </li>
                        ))}
                </ul>

                <div className="my-12 flex flex-col items-stretch gap-4">
                    <h2 className="text-left text-lg text-gray">
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
                        onClick={() =>
                            roomTypeToAdd && handleAddRoom(roomTypeToAdd)
                        }>
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
