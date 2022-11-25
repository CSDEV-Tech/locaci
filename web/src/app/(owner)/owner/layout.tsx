// utils
import { getUser } from '~/server/ssr-helpers';
import { cookies } from 'next/headers';

// types
import type { LayoutProps } from '~/types';
import { redirect } from 'next/navigation';

export default async function OwnerLayout(props: LayoutProps) {
    const session = cookies().get('__session')?.value;
    const user = session ? await getUser(session) : null;

    if (user?.role !== 'PROPERTY_OWNER') {
        redirect(`/auth/login`);
    }

    return <>{props.children}</>;
}
