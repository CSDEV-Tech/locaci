import { cookies } from 'next/headers';
import type { PageProps } from '~/types';
import { getUser } from '~/utils/ssr-helpers';

export default async function ProfilePage(props: PageProps) {
    const session = cookies().get('__session')?.value;
    const user = session ? await getUser(session) : null;

    return (
        <>
            <h1 className="font-extrabold">Profile</h1>
            <pre className="w-full overflow-x-scroll bg-dark p-2 text-white">
                {JSON.stringify(user, null, 2)}
            </pre>
        </>
    );
}
