import * as React from 'react';
// components
import { Button } from '@locaci/ui/components/atoms/button';
import { Checkbox } from '@locaci/ui/components/atoms/checkbox';
import { CheckboxGroup } from '@locaci/ui/components/molecules/checkbox-group';
import { TextInput } from '@locaci/ui/components/atoms/input';
import { CaretDoubleLeft, CaretDoubleRight } from 'phosphor-react';

// utils
import { updatePropertyStep5Schema } from '~/validation/property-schema';
import { useZodForm } from '~/features/shared/hooks/use-zod-form';

// types
import type { z } from 'zod';
import {
    AmenityTypes,
    type PredefinedAmenityTypes
} from '~/features/shared/types';
export type Form6Values = Omit<
    z.TypeOf<typeof updatePropertyStep5Schema>,
    'uid'
>;

export type FormStep6Props = {
    onPreviousClick: () => void;
    onSubmit: (values: Form6Values) => void;
    defaultValues: Partial<Form6Values>;
    isSubmitting: boolean;
};

export function FormStep6(props: FormStep6Props) {
    const form = useZodForm({
        schema: updatePropertyStep5Schema.omit({
            uid: true
        }),
        defaultValues: {
            amenities: props.defaultValues.amenities ?? []
        }
    });

    const amenities = form.watch('amenities');

    const predefinedAmenities = React.useMemo(() => {
        return amenities
            .filter(amenity => amenity.type !== 'OTHER')
            .map(amenity => amenity.type);
    }, [amenities]);

    const customAmenities = React.useMemo(() => {
        return amenities
            .filter(amenity => amenity.type === 'OTHER')
            .map(amenity => ({
                name: amenity.name as string,
                type: 'OTHER'
            })) as {
            name: string;
            type: 'OTHER';
        }[];
    }, [amenities]);

    const [newCustomAmenityName, setNewCustomAmenityName] = React.useState('');

    const inputAddAmenityRef = React.useRef<HTMLInputElement>(null);

    /**
     * Handlers
     */
    function setPredefinedAmenities(types: PredefinedAmenityTypes[]) {
        const nameAmenities = amenities.filter(at => at.type === 'OTHER') as {
            name: string;
            type: 'OTHER';
        }[];

        form.setValue('amenities', [
            ...nameAmenities,
            ...types.map(type => ({ type }))
        ]);
    }

    function addCustomAmenity(name: string) {
        if (name.trim().length === 0) return;

        const predefinedAmenities = amenities.filter(
            amenity => amenity.type !== 'OTHER'
        ) as { type: PredefinedAmenityTypes }[];

        if (
            customAmenities.find(amenity => amenity.name === name) === undefined
        ) {
            form.setValue('amenities', [
                ...predefinedAmenities,
                ...customAmenities,
                {
                    name,
                    type: 'OTHER'
                }
            ]);
        }

        inputAddAmenityRef.current?.focus();
        setNewCustomAmenityName('');
    }

    function removeCustomAmenity(name: string) {
        const predefinedAmenities = amenities.filter(
            amenity => amenity.type !== 'OTHER'
        ) as { type: PredefinedAmenityTypes }[];

        if (
            customAmenities.find(amenity => amenity.name === name) !== undefined
        ) {
            form.setValue('amenities', [
                ...predefinedAmenities,
                ...customAmenities.filter(a => a.name !== name)
            ]);
        }
    }

    return (
        <>
            <div>
                <h2 className="text-center text-2xl font-bold text-secondary">
                    6/8
                </h2>
                <h1 className="px-6 text-center text-2xl font-bold leading-normal md:text-3xl">
                    Quels accessoires mettez-vous à disposition dans votre
                    logement meublé ?
                </h1>
            </div>

            <form
                className="flex flex-col items-stretch gap-4 px-6 md:m-auto md:w-[450px]"
                onSubmit={form.handleSubmit(variables =>
                    props.onSubmit(variables)
                )}>
                <CheckboxGroup
                    onChange={values => {
                        setPredefinedAmenities(
                            values as PredefinedAmenityTypes[]
                        );
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
                    <h2 className="text-left font-semibold text-dark">
                        Autres accessoires
                    </h2>

                    {customAmenities.map(({ name }) => (
                        <Checkbox
                            variant={'secondary'}
                            key={name}
                            label={name}
                            checked
                            onChange={() => {
                                removeCustomAmenity(name);
                            }}
                        />
                    ))}

                    <TextInput
                        ref={inputAddAmenityRef}
                        label={`Nom de l'accessoire`}
                        onChangeValue={setNewCustomAmenityName}
                        value={newCustomAmenityName}
                    />

                    <Button
                        block
                        type={`button`}
                        variant={`hollow`}
                        onClick={() => {
                            addCustomAmenity(newCustomAmenityName);
                        }}>
                        Ajouter l'accessoire
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
                        onClick={() => {
                            console.log({
                                state: form.getValues(),
                                errors: form.formState.errors
                            });
                        }}
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
