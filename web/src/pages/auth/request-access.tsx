// components
import { Controller } from 'react-hook-form';
import { At, Phone, User } from 'phosphor-react';
import { Button, clsx, Select, TextInput } from '@locaci/ui';
import { DefaultLayout } from '@web/components/layouts/default-layout';
import { NextLink, NextLinkButton } from '@web/components/next-link';

// functions & others
import { t } from '@web/utils/trpc-rq-hooks';
import { useZodForm } from '@web/hooks/use-zod-form';
import { requestOwnerAccessSchema } from '@web/server/trpc/validation/auth-schema';

// types
import type { NextPageWithLayout } from '@web/pages/_app';
import { RequestAccessSuccessModal } from '@web/components/request-access-success-modal';

export type RequestPageProps = {};

const RequestPage: NextPageWithLayout<RequestPageProps> = props => {
    const mutation = t.auth.owner.requestAccess.useMutation();

    const form = useZodForm({
        schema: requestOwnerAccessSchema
    });

    return (
        <>
            <RequestAccessSuccessModal open={mutation.isSuccess} />
            <section className="flex h-full items-center justify-center">
                <div
                    className={clsx(
                        'flex h-full w-full flex-col gap-14 px-6 pt-20 pb-10',
                        'md:m-auto md:h-auto md:w-[450px]'
                    )}>
                    <div>
                        <h1 className="text-center text-2xl font-extrabold leading-normal md:text-3xl">
                            Vous êtes un bailleur ?
                        </h1>
                        <h2 className="text-center text-lg text-gray">
                            Entrez vos informations, nous vous contactons et
                            nous vous créons un compte au plus tôt 😇
                        </h2>
                    </div>

                    <form
                        className="flex flex-col items-stretch gap-4"
                        onSubmit={form.handleSubmit(variables =>
                            mutation.mutate(variables)
                        )}>
                        <div className="flex flex-col gap-4 text-lg">
                            <Controller
                                name="civicTitle"
                                control={form.control}
                                render={({
                                    field: { ref, ...field },
                                    formState: { errors }
                                }) => (
                                    <Select
                                        label="Civilité"
                                        {...field}
                                        options={[
                                            { value: 'MR', label: 'Mr' },
                                            { value: 'MME', label: 'Mme' }
                                        ]}
                                        errorText={errors.civicTitle?.message}
                                    />
                                )}
                            />

                            <div className="flex flex-col gap-4 md:flex-row">
                                <TextInput
                                    className="w-full"
                                    required
                                    type="text"
                                    label="Nom"
                                    {...form.register('lastName')}
                                    errorText={
                                        form.formState.errors.lastName?.message
                                    }
                                    appendix={<User weight="fill" />}
                                />
                                <TextInput
                                    className="w-full"
                                    required
                                    type="text"
                                    label="Prénom(s)"
                                    {...form.register('firstName')}
                                    errorText={
                                        form.formState.errors.firstName?.message
                                    }
                                    appendix={<User weight="fill" />}
                                />
                            </div>

                            <TextInput
                                className="w-full"
                                type="email"
                                label="Email"
                                required
                                {...form.register('email')}
                                errorText={form.formState.errors.email?.message}
                                appendix={<At weight="bold" />}
                            />

                            <TextInput
                                className="w-full"
                                required
                                type="text"
                                inputMode="numeric"
                                label="Numéro de téléphone"
                                {...form.register('phoneNumber')}
                                errorText={
                                    form.formState.errors.phoneNumber?.message
                                }
                                appendix={<Phone weight="fill" />}
                            />

                            <Button
                                variant="primary"
                                type="submit"
                                block
                                loading={mutation.isLoading}>
                                Demander votre compte
                            </Button>

                            <small className="text-gray">
                                En cliquant sur "Connexion", vous acceptez
                                nos&nbsp;
                                <NextLink
                                    target="_blank"
                                    className="font-bold"
                                    href="/cgu">
                                    conditions générales
                                </NextLink>
                                &nbsp;et notre&nbsp;
                                <NextLink
                                    target="_blank"
                                    className="font-bold"
                                    href="/terms-and-policy">
                                    politique de confidentialité
                                </NextLink>
                                .
                            </small>
                        </div>
                    </form>
                </div>
            </section>

            <section
                className={clsx(
                    'fixed bottom-0 right-0 z-[-1] hidden',
                    'md:flex md:items-end md:justify-end'
                )}>
                <img
                    src="/empty_street.svg"
                    alt="Maison vide"
                    className={clsx(
                        'w-52 object-contain object-center',
                        'lg:w-64',
                        'xl:w-7'
                    )}
                />
            </section>
        </>
    );
};

export default RequestPage;

RequestPage.getLayout = page => {
    return (
        <DefaultLayout
            hideFooter
            title="Création du compte bailleur"
            className={`md:h-[calc(100vh-78px)]`}
            headerTrailingElement={
                <>
                    <NextLinkButton href="/login" variant="hollow">
                        Connexion
                    </NextLinkButton>
                </>
            }>
            {page}
        </DefaultLayout>
    );
};
