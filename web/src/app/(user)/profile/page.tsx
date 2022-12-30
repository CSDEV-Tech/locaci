import { getUserCached } from '~/server/trpc/rsc/cached-queries';
import { use } from 'react';

import type { PageProps } from '~/types';
export default function ProfilePage(props: PageProps) {
    const user = use(getUserCached());

    return (
        <>
            <h1 className="font-extrabold">Profile</h1>
            <pre className="w-full overflow-x-scroll bg-dark p-2 text-white">
                {JSON.stringify(user, null, 2)}
            </pre>
        </>
    );
}
