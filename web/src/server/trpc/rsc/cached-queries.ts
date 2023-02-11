// these functions should only be called inside server-components
import 'server-only';
import { cache } from 'react';
import { rsc } from './index';
import { use } from 'react';
import { redirect } from 'next/navigation';

export const getAllMunicipalities = cache(() =>
    rsc.geo.getAllMunicipalities.fetch()
);

export const getPropertyDetail = cache((uid: string) =>
    rsc.property.getPropertyDetail.fetch({ uid })
);

export const getUserCached = cache(() => rsc.auth.getUser.fetch());
export const getUserOrRedirect = async () => {
    const user = await getUserCached();

    if (!user) {
        redirect(`/auth/login`);
    }

    return user;
};
