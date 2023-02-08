import { Meta } from '~/features/shared/components/meta';
import { getTitleForSearchParams, parseSearchParams } from '~/lib/functions';
import { HeadProps } from '~/next-app-types';

export default function Head(props: HeadProps) {
    console.log({ props });
    // const searchParsed = parseSearchParams(searchParams!);
    // const title = getTitleForSearchParams(searchParsed);

    return <Meta title={'Recherche de logement'} pathname={`/search`} />;
}
