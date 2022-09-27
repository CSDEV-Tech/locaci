import * as React from 'react';
// components
import { Button, Checkbox, CheckboxGroup, TextInput } from '@locaci/ui';
import { CaretDoubleLeft, CaretDoubleRight } from 'phosphor-react';

// utils
import { createPropertyRequestSchema } from '@web/server/trpc/validation/property-schema';
import { z } from 'zod';
import { AmenityTypes, useZodForm } from '@web/features/shared';

// types
import type { AmenityType } from '@web/features/shared';
export type Form6Values = Pick<
    z.TypeOf<typeof createPropertyRequestSchema>,
    'amenities'
>;

export type FormStep6Props = {
    onPreviousClick: () => void;
    onSubmit: (values: Form6Values) => void;
    defaultValues: Partial<Form6Values>;
};

export function FormStep6(props: FormStep6Props) {
    const form = useZodForm({
        schema: createPropertyRequestSchema.pick({
            amenities: true
        }),
        defaultValues: {
            amenities: [],
            ...props.defaultValues
        }
    });

    const amenities = form.watch('amenities');

    const predefinedAmenities = React.useMemo(() => {
        return (
            amenities
                .filter(at => at.hasOwnProperty('type'))
                // @ts-ignore
                .map(a => a.type) as AmenityType[]
        );
    }, [amenities]);

    const customAmenities = React.useMemo(() => {
        return (
            amenities
                .filter(at => at.hasOwnProperty('name'))
                // @ts-ignore
                .map(a => a.name) as string[]
        );
    }, [amenities]);

    const [customAmenity, setCustomAmenity] = React.useState('');

    function handleSetPredefinedAmenities(types: AmenityType[]) {
        const nameAmenities = amenities.filter(at =>
            at.hasOwnProperty('name')
        ) as { name: string }[];
        form.setValue('amenities', [
            ...nameAmenities,
            ...types.map(type => ({ type }))
        ]);
    }

    function handleAddCustomAmenity(name: string) {
        const predefinedAmenities = amenities.filter(at =>
            at.hasOwnProperty('type')
        ) as { type: AmenityType }[];

        if (!customAmenities.includes(name)) {
            form.setValue('amenities', [
                ...predefinedAmenities,
                ...customAmenities.map(name => ({ name })),
                {
                    name
                }
            ]);
        }

        setCustomAmenity('');
    }

    function handleRemoveCustomAmenity(name: string) {
        const predefinedAmenities = amenities.filter(at =>
            at.hasOwnProperty('type')
        ) as { type: AmenityType }[];

        if (customAmenities.includes(name)) {
            form.setValue('amenities', [
                ...predefinedAmenities,
                ...customAmenities
                    .filter(a => a !== name)
                    .map(name => ({ name }))
            ]);
        }
    }

    return (
        <>
            <div>
                <h1 className="px-6 text-center text-2xl font-extrabold leading-normal md:text-3xl">
                    Quels accessoires mettez-vous à disposition dans votre
                    logement meublé ?
                </h1>
            </div>

            <form
                className="flex flex-col items-stretch gap-4 px-6"
                onSubmit={form.handleSubmit(variables =>
                    props.onSubmit(variables)
                )}>
                <CheckboxGroup
                    onChange={values => {
                        handleSetPredefinedAmenities(values as AmenityType[]);
                    }}
                    options={Object.entries(AmenityTypes).map(
                        ([key, value]) => ({
                            label: value,
                            value: key
                        })
                    )}
                    value={predefinedAmenities}
                    label={'Accessoires Inclus'}
                    variant={'secondary'}
                />

                <div className="mt-4 mb-12 flex flex-col items-stretch gap-4">
                    <h2 className="text-left text-lg text-gray">
                        Ajouter un autre accessoire
                    </h2>

                    {customAmenities.map(name => (
                        <Checkbox
                            variant={'secondary'}
                            key={name}
                            label={name}
                            checked
                            onChange={() => {
                                handleRemoveCustomAmenity(name);
                            }}
                        />
                    ))}

                    <TextInput
                        label={`Nom de l'accessoire`}
                        onChangeValue={setCustomAmenity}
                        value={customAmenity}
                    />

                    <Button
                        block
                        type={`button`}
                        variant={`hollow`}
                        onClick={() => {
                            handleAddCustomAmenity(customAmenity);
                        }}>
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
