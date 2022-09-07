import * as React from 'react';
// components
import {
    Avatar,
    Button,
    clsx,
    LoadingIndicator,
    Modal,
    Tag,
    TextArea
} from '@locaci/ui';
import { DefaultLayout } from '../../components/layouts/default-layout';
import { Link, Prohibit } from 'phosphor-react';
import { Controller } from 'react-hook-form';
import { NextLinkButton } from 'web/src/components/next-link';

// functions & others
import toast from 'react-hot-toast';
import { t } from 'web/src/utils/trpc-rq-hooks';
import { useRouter } from 'next/router';
import { RequestStatus, Role } from '@prisma/client';
import { formatDate, getHostWithScheme } from 'web/src/lib/functions';
import { useZodForm } from 'web/src/hooks/use-zod-form';
import { refuseOwnerAccessSchema } from 'web/src/server/trpc/validation/auth-schema';

// types
import type { NextPageWithLayout } from '../_app';
import type { AppRouter } from 'web/src/server/trpc/router';
import type { inferProcedureOutput } from '@trpc/server';
import type { ArrayElement } from 'web/src/utils/types';

export type DashBoardAdminPageProps = {};

const AdminPage: NextPageWithLayout<DashBoardAdminPageProps> = props => {
    const utils = t.proxy.useContext();

    const { data: user, isLoading } =
        t.proxy.auth.getAuthenticatedUser.useQuery();
    const router = useRouter();

    const { data: requests, isLoading: isLoadingRequests } =
        t.proxy.admin.getAllRequests.useQuery(undefined, {
            enabled: !!user && user.role === Role.ADMIN
        });

    const generateLinkMutation =
        t.proxy.admin.generateLinkForOwner.useMutation();

    const refuseOwnerAccessMutation =
        t.proxy.admin.refuseOwnerAccess.useMutation({
            async onSuccess(data, variables, context) {
                await utils.admin.getAllRequests.invalidate();
                form.reset();
            }
        });

    const form = useZodForm({
        schema: refuseOwnerAccessSchema.omit({
            uid: true
        })
    });

    if (user && user.role !== Role.ADMIN) {
        toast.error("Vous n'avez pas le droit d'accéder à cette page");
        router.replace(`/login`);
        return <></>;
    }

    async function generateLink(variables: { uid: string; host: string }) {
        const link = await generateLinkMutation.mutateAsync(variables);
        // alert(`The link is : ${link}`);
        toast.success('Message copié dans votre presse-papier');
        await navigator.clipboard.writeText(link);
    }

    async function refuseAccess(variables: { uid: string; reason: string }) {
        await refuseOwnerAccessMutation.mutateAsync(variables);
        toast('Requête refusée avec succès', {
            icon: 'ℹ️'
        });
    }

    return isLoading || isLoadingRequests ? (
        <section className="flex h-screen w-screen items-center justify-center">
            <h1 className="flex items-center gap-4 text-4xl">
                <LoadingIndicator className="h-10" />
                <span>CHARGEMENT...</span>
            </h1>
        </section>
    ) : (
        <section className="my-8 w-full">
            <h1 className="mt-8 mb-4 text-center text-xl font-bold uppercase">
                Liste des requêtes de création de compte propriétaire
            </h1>
            <div className="overflow-x-auto overflow-y-auto">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="border-b border-gray bg-accent-primary py-2 px-4 text-left text-base uppercase">
                                Nom
                            </th>
                            <th className="border-b border-gray bg-accent-primary py-2 px-4 text-left text-base uppercase">
                                Prénoms
                            </th>
                            <th className="border-b border-gray bg-accent-primary py-2 px-4 text-left text-base uppercase">
                                Email
                            </th>
                            <th className="border-b border-gray bg-accent-primary py-2 px-4 text-left text-base uppercase">
                                Numéro de téléphone
                            </th>
                            <th className="border-b border-gray bg-accent-primary py-2 px-4 text-left text-base uppercase">
                                Date de la demande
                            </th>
                            <th className="border-b border-gray bg-accent-primary py-2 px-4 text-left text-base uppercase">
                                Etat
                            </th>
                            <th className="border-b border-gray bg-accent-primary py-2 px-4 text-left text-base uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests?.map((request, index) => (
                            <tr
                                key={request.id}
                                className={clsx('border-b border-lightgray')}>
                                <td className="px-4 py-2">
                                    {request.user.lastName}
                                </td>
                                <td className="px-4 py-2">
                                    {request.user.firstName}
                                </td>
                                <td className="px-4 py-2">
                                    {request.user.email}
                                </td>
                                <td className="px-4 py-2">
                                    {request.user.phoneNumber ?? (
                                        <span className="text-gray">
                                            Non saisi
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-2">
                                    {formatDate(request.createdAt)}
                                </td>
                                <td className="px-4 py-2">
                                    <Tag
                                        className="whitespace-nowrap"
                                        variant={
                                            request.status ===
                                            RequestStatus.WAITING
                                                ? 'hollow'
                                                : request.status ===
                                                  RequestStatus.GRANTED
                                                ? 'secondary-light'
                                                : 'primary-light'
                                        }>
                                        {clsx({
                                            'En attente':
                                                request.status ===
                                                RequestStatus.WAITING,
                                            Accepté:
                                                request.status ===
                                                RequestStatus.GRANTED,
                                            Refusé:
                                                request.status ===
                                                RequestStatus.REFUSED
                                        })}
                                    </Tag>
                                </td>
                                <td className="flex items-center gap-2 px-4 py-2">
                                    {request.status ===
                                        RequestStatus.WAITING && (
                                        <>
                                            <GenerateLinkButton
                                                request={request}
                                            />
                                            <RefuseAccessButton
                                                request={request}
                                            />
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}

                        {requests?.length === 0 && (
                            <tr className="border-b">
                                <td
                                    className="bg-accent-primary-70 py-4 text-center font-semibold text-gray "
                                    colSpan={6}>
                                    AUCUNE REQUÊTE EFFECTUÉE POUR L'INSTANT.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default AdminPage;

function GenerateLinkButton({
    request
}: {
    request: ArrayElement<
        inferProcedureOutput<AppRouter['admin']['getAllRequests']>
    >;
}) {
    const generateLinkMutation =
        t.proxy.admin.generateLinkForOwner.useMutation();

    async function generateLink(variables: { uid: string; host: string }) {
        const link = await generateLinkMutation.mutateAsync(variables);
        toast.success('Message copié dans votre presse-papier');
        await navigator.clipboard.writeText(link);
    }

    return (
        <>
            <Button
                variant="primary"
                className="whitespace-nowrap"
                loading={generateLinkMutation.isLoading}
                onClick={() => {
                    generateLink({
                        uid: request.id,
                        host: getHostWithScheme(window.location.href)
                    });
                }}
                renderLeadingIcon={cls => <Link className={cls} />}>
                Générer le lien
            </Button>
        </>
    );
}

function RefuseAccessButton({
    request
}: {
    request: ArrayElement<
        inferProcedureOutput<AppRouter['admin']['getAllRequests']>
    >;
}) {
    const utils = t.proxy.useContext();
    const refuseOwnerAccessMutation =
        t.proxy.admin.refuseOwnerAccess.useMutation({
            async onSuccess(data, variables, context) {
                await utils.admin.getAllRequests.invalidate();
                form.reset();
            }
        });
    const form = useZodForm({
        schema: refuseOwnerAccessSchema.omit({
            uid: true
        })
    });

    const [modalOpen, setModalOpen] = React.useState(false);

    async function refuseAccess(variables: { uid: string; reason: string }) {
        await refuseOwnerAccessMutation.mutateAsync(variables);
        setModalOpen(false);

        toast('Requête refusée avec succès', {
            icon: 'ℹ️'
        });
    }

    return (
        <>
            <Button
                className="whitespace-nowrap"
                variant="dark"
                onClick={() => setModalOpen(true)}
                renderLeadingIcon={cls => <Prohibit className={cls} />}>
                Refuser
            </Button>

            <Modal
                title="Refuser l'accès"
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}>
                <form
                    className="flex w-full flex-col gap-2"
                    onSubmit={form.handleSubmit(({ reason }) =>
                        refuseAccess({
                            reason,
                            uid: request.id
                        })
                    )}>
                    <Controller
                        control={form.control}
                        name="reason"
                        render={({
                            field: { onChange, onBlur, value, name, ref },
                            fieldState: { error }
                        }) => (
                            <TextArea
                                label="raison du refus"
                                cols={20}
                                value={value}
                                name={name}
                                onChange={onChange} // send value to hook form
                                onBlur={onBlur} // notify when input is touched
                                ref={ref} // wire up the input ref
                                errorText={error?.message}
                            />
                        )}
                    />
                    <Button
                        variant="dark"
                        loading={refuseOwnerAccessMutation.isLoading}
                        type="submit">
                        Envoyer
                    </Button>
                </form>
            </Modal>
        </>
    );
}

AdminPage.getLayout = page => {
    const { data: user, isLoading } =
        t.proxy.auth.getAuthenticatedUser.useQuery();

    return (
        <DefaultLayout
            className="relative overflow-x-hidden"
            headerTrailingElement={
                !isLoading && (
                    <NextLinkButton href="/admin" className="gap-4">
                        <span className="font-semibold">
                            {user?.firstName} {user?.lastName}{' '}
                            <span className="text-gray">ADMIN</span>
                        </span>
                        <Avatar
                            name={`${user?.firstName} ${user?.lastName}`}
                            // TODO : Use user's image
                            src="https://i.pravatar.cc/300"
                        />
                    </NextLinkButton>
                )
            }>
            {page}
        </DefaultLayout>
    );
};
