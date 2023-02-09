import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import type {
    AmenityType,
    RentType,
    RoomType,
    ListingImage
} from '~/features/shared/types';
import type {
    Amenity,
    City,
    Municipality,
    Property,
    Room
} from '@prisma/client';
import type { GeoJSON } from '~/lib/types';
import type { SearchQueryParams } from '~/lib/functions';
import type { SearchParams } from 'typesense/lib/Typesense/Documents';

import short from 'short-uuid';
import { Client as TypeSenseClient } from 'typesense';

type IndexableProperty = Property & {
    city: City;
    municipality: Municipality;
    rooms: Room[];
    amenities: Amenity[];
};

type TypeSenseSearchResultItem = {
    id: string;
    availabilityTimestamp: number;
    housingFee: number;
    surface: number;
    noOfRooms: number;
    noOfBedRooms: number;
    cityName: string;
    cityId: string;
    housingPeriod: number;
    address: string;
    images: string[];
    rentType: RentType;
    municipalityId: string;
    municipalityName: string;
    amenities: AmenityType[];
    rooms: RoomType[];
    geojson: Array<[number, number]>;
    center: [number, number];
};

/**
 * This number is got from `src/lib/validation-schemas/search-schema.ts`
 * we cannot import that value here Because we want to isolate this file from nextjs bundle
 *      and use it in a standalone script
 */
export const MAX_NUMBER_VALUE = 999_999_999_999; /// 999 milliards

export class TypeSenseSearch {
    #COLLECTION_NAME = 'properties';
    #PER_PAGE = 24;
    #client: TypeSenseClient;

    constructor(apiKey: string, host: string) {
        const url = new URL(host);
        this.#client = new TypeSenseClient({
            nodes: [
                {
                    host: url.hostname,
                    port: Number(url.port),
                    protocol: url.protocol.substring(0, url.protocol.length - 1)
                }
            ],
            apiKey: apiKey,
            connectionTimeoutSeconds: 2
        });
    }

    #convertToDocument(property: IndexableProperty): TypeSenseSearchResultItem {
        const geojson = property.geoData as GeoJSON;

        return {
            id: short().fromUUID(property.id),
            address: property.localityName,
            center: [Number(property.latitude), Number(property.longitude)],
            images: (property.images as ListingImage[]).map(im => im.uri),
            availabilityTimestamp: property.availableFrom.getTime(),
            housingFee: property.housingFee,
            housingPeriod: property.housingPeriod,
            surface: property.surfaceArea,
            cityId: short().fromUUID(property.cityId),
            cityName: property.city.name,
            municipalityId: short().fromUUID(property.municipalityId),
            municipalityName: property.municipality.name,
            noOfRooms: property.noOfRooms,
            noOfBedRooms: property.rooms.filter(r => r.type === 'BEDROOM')
                .length,
            rentType: property.rentType,
            amenities: property.amenities.map(am => am.type),
            rooms: property.rooms.map(r => r.type),
            geojson:
                geojson.type === 'Point'
                    ? [geojson.coordinates]
                    : geojson.coordinates[0]
        };
    }

    /**
     * Index one or multiple properties
     */
    public async index(data: IndexableProperty | IndexableProperty[]) {
        if (Array.isArray(data)) {
            const documents = data.map(this.#convertToDocument);

            return this.#client
                .collections(this.#COLLECTION_NAME)
                .documents()
                .import(documents, { action: 'upsert' });
        } else {
            return this.#client
                .collections(this.#COLLECTION_NAME)
                .documents()
                .upsert(this.#convertToDocument(data));
        }
    }

    public async retrieve(id: string) {
        return this.#client
            .collections<TypeSenseSearchResultItem>(this.#COLLECTION_NAME)
            .documents(id)
            .retrieve();
    }

    public async search(query: SearchQueryParams) {
        let filters: string[] = [];

        filters.push(
            `housingFee:[${query.minPrice ?? 0}..${
                query.maxPrice ?? MAX_NUMBER_VALUE
            }]`
        );

        filters.push(
            `surface:[${query.minArea ?? 0}..${
                query.maxArea ?? MAX_NUMBER_VALUE
            }]`
        );

        filters.push(
            `noOfRooms:[${query.minNoOfRooms ?? 0}..${
                query.maxNoOfRooms ?? MAX_NUMBER_VALUE
            }]`
        );
        filters.push(
            `noOfBedRooms:[${query.minNoOfBedRooms ?? 0}..${
                query.maxNoOfBedRooms ?? MAX_NUMBER_VALUE
            }]`
        );

        if (query.rentType !== undefined && query.municipalityId !== null) {
            filters.push(`rentType:=${query.rentType}`);
        }

        if (
            query.municipalityId !== undefined &&
            query.municipalityId !== null
        ) {
            filters.push(`municipalityId:=${query.municipalityId}`);
        }

        if (query.availableFrom) {
            filters.push(
                `availabilityTimestamp:>=${query.availableFrom.getTime()}`
            );
        }

        if (query.amenities && query.amenities.length > 0) {
            filters.push(`amenities:[${query.amenities.join(',')}]`);
        }

        if (query.rooms && query.rooms.length > 0) {
            filters.push(`rooms:[${query.rooms.join(',')}]`);
        }

        if (query.bbox) {
            const [minLon, minLat, maxLon, maxLat] = query.bbox;
            const polygon = [
                minLon,
                minLat,
                maxLon,
                minLat,
                maxLon,
                maxLat,
                minLon,
                maxLat
            ] as const;

            // construct the polygon geojson of the bounding box
            filters.push(`geojson:(${polygon.join(', ')})`);
        }
        const filteredFields = [
            'address',
            'cityName',
            'housingFee',
            'housingPeriod',
            'cityName',
            'center',
            'id',
            'images',
            'surface',
            'noOfBedRooms',
            'noOfRooms',
            'rentType',
            'municipalityId',
            'municipalityName'
        ] as const satisfies readonly (keyof TypeSenseSearchResultItem)[];

        const searchParams = {
            sort_by: 'housingFee:asc,availabilityTimestamp:asc',
            filter_by: filters.join(' && '),
            per_page: this.#PER_PAGE,
            page: query.page ?? 1,
            // do not match by municipality name if the id is already provided
            q: query.municipalityId ? '' : query.municipalityQuery ?? '',
            include_fields: filteredFields.join(','),
            query_by: 'municipalityName,cityName,address'
        } satisfies SearchParams;

        const result = await this.#client
            .collections<
                Pick<TypeSenseSearchResultItem, typeof filteredFields[number]>
            >(this.#COLLECTION_NAME)
            .documents()
            .search(searchParams);

        return {
            page: result.page,
            total: result.found,
            total_pages: Math.ceil(result.found / this.#PER_PAGE),
            properties: result.hits ?? []
        };
    }

    /**
     * Create the index.
     */
    public async createIndex() {
        const searchSchema = {
            name: this.#COLLECTION_NAME,
            fields: [
                {
                    name: 'availabilityTimestamp',
                    type: 'int64'
                },
                {
                    name: 'housingFee',
                    type: 'int64'
                },
                {
                    name: 'surface',
                    type: 'int64'
                },
                {
                    name: 'noOfRooms',
                    type: 'int64'
                },
                {
                    name: 'noOfBedRooms',
                    type: 'int64'
                },
                {
                    name: 'cityId',
                    type: 'string'
                },
                {
                    name: 'cityName',
                    type: 'string'
                },
                {
                    name: 'housingPeriod',
                    type: 'int32'
                },
                {
                    name: 'address',
                    type: 'string'
                },
                {
                    name: 'images',
                    type: 'string[]'
                },
                {
                    name: 'rentType',
                    type: 'string',
                    facet: true
                },
                {
                    name: 'municipalityId',
                    type: 'string',
                    facet: true
                },
                {
                    name: 'municipalityName',
                    type: 'string'
                },
                {
                    name: 'amenities',
                    type: 'string[]',
                    facet: true
                },
                {
                    name: 'rooms',
                    type: 'string[]',
                    facet: true
                },
                {
                    name: 'geojson',
                    type: 'geopoint[]'
                },
                {
                    name: 'center',
                    type: 'geopoint'
                }
            ],
            default_sorting_field: 'housingFee'
        } satisfies CollectionCreateSchema;

        this.#client.collections().create(searchSchema);
    }

    /**
     * Delete a document from index.
     */
    public async remove(id: string) {
        const element = await this.#client
            .collections<TypeSenseSearchResultItem>(this.#COLLECTION_NAME)
            .documents(id)
            .retrieve();

        if (element) {
            return this.#client
                .collections<TypeSenseSearchResultItem>(this.#COLLECTION_NAME)
                .documents(id)
                .delete();
        }
    }

    /**
     * Clean data from index.
     */
    public async clean() {
        try {
            await this.#client.collections(this.#COLLECTION_NAME).delete();
        } catch (e) {
            console.error((e as Error).message);
            return;
        }
    }
}
