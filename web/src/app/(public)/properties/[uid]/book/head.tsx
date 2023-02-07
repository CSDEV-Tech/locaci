import { use } from 'react';
import { Meta } from '~/features/shared/components/meta';
import { getPropertyDetail } from '~/server/trpc/rsc/cached-queries';
import { capitalize, getPropertyTitle } from '~/lib/functions';

// types
import type { HeadProps } from '~/next-app-types';
import type { ListingImage } from '~/features/shared/types';

export default function Head({ params }: HeadProps<{ uid: string }>) {
    const property = use(getPropertyDetail(params.uid));

    let title = 'Erreur 404';

    if (property) {
        const type = getPropertyTitle({
            noOfRooms: property.noOfRooms,
            rentType: property.rentType
        });

        const commune = capitalize(property.municipality.name);

        title = `Effectuer une visite pour un ${type} à ${commune}`;
    }

    return (
        <Meta
            title={title}
            pathname={`/properties/${params.uid}/book`}
            description={property?.description}
            imageURL={(property?.images as Array<ListingImage>)?.[0]?.uri}
        />
    );
}
