import { formatNumberToFCFA } from '@locaci/ui/lib/functions';
import { use } from 'react';
import { Meta } from '~/features/shared/components/meta';
import { getPropertyDetail } from '~/server/utils';
import { capitalize, getPropertyTitle } from '~/utils/functions';

// types
import type { HeadProps } from '~/types';
import type { ListingImage } from '~/features/shared/types';

export default function Head({ params }: HeadProps<{ uid: string }>) {
    const property = use(getPropertyDetail(params.uid));

    let title = 'Erreur 404';

    if (property) {
        const type = getPropertyTitle({
            noOfRooms: property.noOfRooms,
            rentType: property.rentType
        });

        const surface = `${property.surfaceArea} m²`;
        const rooms = `${property.noOfRooms} pièce${
            property.noOfRooms > 1 ? 's' : ''
        }`;

        const price = `${formatNumberToFCFA(property.housingFee)}/${
            property.housingPeriod === 30
                ? 'mois'
                : property.housingPeriod === 7
                ? 'semaine'
                : 'jour'
        }`;

        const commune = capitalize(property.municipality.name);

        title = `${type} à ${commune} - ${surface} - ${rooms} - ${price}`;
    }

    return (
        <Meta
            title={title}
            pathname={`/properties/${params.uid}`}
            description={property?.description}
            type={`article`}
            articlePublishedAt={property?.createdAt}
            imageURL={(property?.images as Array<ListingImage>)[0]?.uri}
        />
    );
}
