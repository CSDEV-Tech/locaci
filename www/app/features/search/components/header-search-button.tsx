// components
import { SearchBar } from '~/www/features/search/components/search-bar';

// utils
import { clsx } from '@locaci/ui/lib/functions';
import { useLocation, useSearchParams } from '@remix-run/react';

// types
import type { RentType } from '~/features/shared/types';
type HeaderSearchButtonProps = {
    defaultMunicipalities: { label: string; value: string }[];
};

export function HeaderSearchButton(props: HeaderSearchButtonProps) {
    const { pathname: path } = useLocation();
    const [searchParams] = useSearchParams();

    return (
        <>
            {path !== '/' && (
                <>
                    <SearchBar
                        minimalStyle
                        className={clsx(
                            'mx-auto hidden w-full shadow-md lg:flex',
                            'lg:mx-8 lg:w-fit lg:shadow-none'
                        )}
                        defaultValues={{
                            municipalityQuery: searchParams.get(
                                'municipalityId[label]'
                            ),
                            municipalityValue: searchParams.get(
                                'municipalityId[value]'
                            ),
                            rentType: searchParams.get(
                                'rentType'
                            ) as RentType | null
                        }}
                        defaultMunicipalities={props.defaultMunicipalities}
                    />
                </>
            )}
        </>
    );
}
