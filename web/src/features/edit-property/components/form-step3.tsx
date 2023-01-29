'use client';
import * as React from 'react';

// components
import { Button } from '@locaci/ui/components/atoms/button';
import { LoadingIndicator } from '@locaci/ui/components/atoms/loading-indicator';
import { CaretDoubleLeft, CaretDoubleRight } from 'phosphor-react';
import { MapPin } from '@locaci/ui/components/molecules/map-pin';
import { HouseIcon } from '@locaci/ui/components/atoms/icons/house';

// utils
import dynamic from 'next/dynamic';
import { t } from '~/app/trpc-client-provider';
import { updatePropertyStep2Schema } from '~/lib/validation-schemas/property-schema';

// types
import type { z } from 'zod';
import type { BoundingBox } from '~/lib/types';
import type { MarkerProps } from '~/features/shared/components/map';

export type Form3Values = Pick<
    z.TypeOf<typeof updatePropertyStep2Schema>,
    'longitude' | 'latitude' | 'geoJSON' | 'localityOSMID' | 'localityName'
>;

type FormStep3Props = {
    defaultValues: {
        localityOSMID: string;
        boundingbox: BoundingBox;
    };
    onPreviousClick: () => void;
    onSubmit: (values: Omit<Form3Values, 'localityName'>) => void;
    isSubmitting: boolean;
};

// lazy load the map component
const Map = dynamic(() => import('~/features/shared/components/map'), {
    ssr: false
});

/**
 * A wrapper around the map loading
 * @param props
 * @returns
 */
function MapLoader(props: { localityOSMID: string; boundingbox: BoundingBox }) {
    const { data } = t.geo.getLocalityByOSMID.useQuery(
        {
            osm_place_id: props.localityOSMID
        },
        {
            staleTime: Infinity,
            refetchOnMount: false
        }
    );

    return (
        <>
            {data && (
                <Map
                    markers={[
                        {
                            center: [
                                Number(data.centroid.coordinates[1]),
                                Number(data.centroid.coordinates[0])
                            ],
                            id: props.localityOSMID,
                            geojson: data.geometry
                        }
                    ]}
                    markerComponent={Marker}
                    boundingbox={props.boundingbox}
                />
            )}
        </>
    );
}

function Marker(props: MarkerProps) {
    return (
        <MapPin
            id={`${props.baseId}-${props.id}`}
            children={
                <div className="rounded-md bg-white p-2 shadow-md">
                    <HouseIcon className="h-4 w-4 text-dark" weight="fill" />
                </div>
            }
        />
    );
}

export function FormStep3(props: FormStep3Props) {
    const { data, isLoading } = t.geo.getLocalityByOSMID.useQuery({
        osm_place_id: props.defaultValues.localityOSMID
    });

    return (
        <>
            <div className="flex flex-col gap-14 md:m-auto md:w-[800px] lg:w-[1000px]">
                <div className="flex flex-col gap-2">
                    <h2 className="text-center text-2xl font-bold text-secondary">
                        3/8
                    </h2>

                    <h1 className="px-6 text-center text-2xl font-bold leading-normal md:text-3xl">
                        Est-ce que le placement du point sur la carte est
                        correct ?
                    </h1>

                    <h2 className="text-center text-lg text-gray">
                        Si ce n'est pas le cas, veuillez retourner à l'étape
                        précédente et changer de quartier ou commune
                    </h2>
                </div>

                <div className="relative h-[25rem] bg-primary-15 md:h-[32rem]">
                    <React.Suspense
                        fallback={
                            <div className="absolute top-1/2 left-1/2 inline-flex -translate-y-1/2 -translate-x-1/2 items-center gap-2">
                                <LoadingIndicator className="h-4 w-4" />
                                <span>Chargement de la carte</span>
                            </div>
                        }>
                        <MapLoader
                            localityOSMID={props.defaultValues.localityOSMID}
                            boundingbox={props.defaultValues.boundingbox}
                        />
                    </React.Suspense>
                </div>

                <div className="flex items-center gap-4 px-6 md:mx-auto md:w-[450px]">
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
                        type="button"
                        loading={isLoading || props.isSubmitting}
                        loadingMessage={`Veuillez attendre le chargement de la carte avant de passer à la suite`}
                        onClick={() =>
                            props.onSubmit({
                                localityOSMID: data!.place_id.toString(),
                                longitude:
                                    data!.centroid.coordinates[0].toString(),
                                latitude:
                                    data!.centroid.coordinates[1].toString(),
                                geoJSON: data!.geometry
                            })
                        }
                        variant="dark"
                        className="w-full"
                        renderTrailingIcon={cls => (
                            <CaretDoubleRight className={cls} />
                        )}>
                        Suivant
                    </Button>
                </div>
            </div>
        </>
    );
}
