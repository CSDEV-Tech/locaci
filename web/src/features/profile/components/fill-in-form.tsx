import * as React from 'react';
// components
import { Button, TextInput } from '@locaci/ui';
import { LazyBottomSheet } from '~/features/shared/components/lazy-bottom-sheet';
import { LazyModal } from '~/features/shared/components/lazy-modal';

// utils & functions
import { t } from '~/utils/trpc-rq-hooks';
import { useZodForm } from '~/features/shared/hooks/use-zod-form';
import { updateNameAndProfileSchema } from '~/server/trpc/validation/auth-schema';
import useMediaQuery from '~/features/shared/hooks/use-media-query';

// types
import type { z } from 'zod';

export default function FillInForm() {
    const { data: user, isFetching: userIsFetching } =
        t.auth.getAuthenticatedUser.useQuery();
    const form = useZodForm({
        schema: updateNameAndProfileSchema
    });

    const utils = t.useContext();

    const mutation = t.auth.updateNameProfile.useMutation({
        async onSuccess() {
            await utils.auth.getAuthenticatedUser.invalidate();
            form.reset();
        }
    });

    async function fillInForm(
        values: z.TypeOf<typeof updateNameAndProfileSchema>
    ) {
        mutation.mutateAsync(values);
    }

    const FormContent = () => (
        <>
            <div className="flex h-full flex-col items-center justify-center gap-6 px-6 py-10">
                <h2 className="text-2xl font-extrabold">Avant de continuer</h2>

                <p className="text-left text-gray" aria-live="assertive">
                    Vous êtes connecté avec succès, pour terminer votre
                    inscription veuillez completer le reste des informations.
                </p>

                <form
                    onSubmit={form.handleSubmit(fillInForm)}
                    className="flex w-full flex-col items-stretch gap-4 text-lg">
                    <TextInput
                        className="w-full"
                        type="text"
                        label="Nom"
                        required
                        {...form.register('lastName')}
                        errorText={form.formState.errors.lastName?.message}
                    />
                    <TextInput
                        className="w-full"
                        type="text"
                        label="Prénom(s)"
                        required
                        {...form.register('firstName')}
                        errorText={form.formState.errors.firstName?.message}
                    />

                    <TextInput
                        className="w-full"
                        type="email"
                        label="Email"
                        disabled
                        value={user?.email}
                    />

                    <Button
                        variant="primary"
                        type="submit"
                        block
                        loading={mutation.isLoading || userIsFetching}>
                        Terminer l'inscription
                    </Button>
                </form>
            </div>
        </>
    );

    const canshowModal = useMediaQuery(`(min-width: 768px)`);
    const canshowBottomSheet = useMediaQuery(`(max-width: 767px)`);

    return (
        <>
            {canshowBottomSheet && (
                <LazyBottomSheet
                    open={
                        !!user &&
                        (user.firstName === null || user.lastName === null)
                    }
                    expandOnContentDrag
                    className={`md:hidden`}
                    snapPoints={({ minHeight }) => [minHeight]}>
                    <FormContent />
                </LazyBottomSheet>
            )}

            {canshowModal && (
                <LazyModal
                    title="Attention"
                    isOpen={
                        !!user &&
                        (user.firstName === null || user.lastName === null)
                    }>
                    <FormContent />
                </LazyModal>
            )}
        </>
    );
}
