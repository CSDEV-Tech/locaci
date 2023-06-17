'use client';
import * as React from 'react';

// components
import {
    DashboardPropertyCard,
    HorizontalDashboardPropertyCard
} from '@locaci/ui/components/molecules/dashboard-property-card';
import { NextLink } from '~/features/shared/components/next-link';
import Image from 'next/image';
import { CopyIcon } from '@locaci/ui/components/atoms/icons/copy';
import { EyeIcon } from '@locaci/ui/components/atoms/icons/eye';
import { EyeSlashIcon } from '@locaci/ui/components/atoms/icons/eye-slash';
import { LinkIcon } from '@locaci/ui/components/atoms/icons/link';
import { PencilIcon } from '@locaci/ui/components/atoms/icons/pencil';
import { TrashIcon } from '@locaci/ui/components/atoms/icons/trash';
import { DropdownItem } from '@locaci/ui/components/molecules/dropdown';
import { DeleteConfirmationModal } from './delete-confirmation-modal';

// utils
import { clsx } from '@locaci/ui/lib/functions';
import { t } from '~/app/(routes)/trpc-client-provider';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Uuid } from '~/lib/uuid';

// types
import type { DashboardPropertyCardProps } from '@locaci/ui/components/molecules/dashboard-property-card';

export type PropertyDraftCardProps = Omit<
    DashboardPropertyCardProps,
    'customLink' | 'customImage' | 'actions'
> & {
    id: string;
};

export function PropertyDraftCard({
    id,
    isDraft,
    href,
    title,
    ...props
}: PropertyDraftCardProps) {
    // state
    const router = useRouter();
    const [deletedPropertiesIds, setDeletedPropertiesIds] = React.useState<
        string[]
    >([]);
    const [_, startTransition] = React.useTransition();
    const [isModalConfirmationOpen, setModalConfirmationOpenState] =
        React.useState(false);

    // mutations
    const { mutate: deleteDraft } = t.owner.draft.deleteDraft.useMutation({
        onSuccess() {
            startTransition(() => router.refresh());
            toast.success(`Ce brouillon a bien été supprimé`);
        }
    });

    const { mutate: deleteProperty } =
        t.owner.property.deleteProperty.useMutation({
            onSuccess() {
                startTransition(() => router.refresh());
                toast.success(`Votre logement a bien été supprimé`);
            }
        });

    const { mutate: duplicateProperty } =
        t.owner.property.duplicate.useMutation({
            onSuccess() {
                startTransition(() => router.refresh());
                toast.success(`Votre logement a bien été dupliqué`);
            }
        });

    const { mutate: toggleVisibility } =
        t.owner.property.toggleVisibility.useMutation({
            onSuccess(data) {
                startTransition(() => router.refresh());
                toast.success(
                    `Votre logement a bien été ${
                        data.isActive ? 'publié' : 'dépublié'
                    }`
                );
            }
        });

    async function handleDelete() {
        if (isDraft) {
            deleteDraft({ uid: id });
        } else {
            deleteProperty({ uid: id });
        }

        setDeletedPropertiesIds(oldIds => {
            return [...oldIds, id];
        });
    }

    const actions: DropdownItem[] = !isDraft
        ? [
              {
                  href: `/properties/${new Uuid(id).short()}`,
                  text: 'Voir sur le site',
                  Icon: props => (
                      <LinkIcon className={props.className} weight="bold" />
                  )
              },
              {
                  href,
                  text: 'Modifier',
                  Icon: props => (
                      <PencilIcon className={props.className} weight="bold" />
                  )
              },
              {
                  onClick() {
                      toggleVisibility({ uid: id });
                  },
                  text: props.isActiveForListing ? 'Dépublier' : 'Publier',
                  Icon: ({ className }) =>
                      props.isActiveForListing ? (
                          <EyeSlashIcon className={className} weight="fill" />
                      ) : (
                          <EyeIcon className={className} weight="bold" />
                      )
              },
              {
                  onClick() {
                      duplicateProperty({ uid: id });
                  },
                  text: 'Dupliquer',
                  Icon: props => (
                      <CopyIcon className={props.className} weight="bold" />
                  )
              },
              {
                  onClick: () => setModalConfirmationOpenState(true),
                  text: 'Supprimer',
                  Icon: props => (
                      <TrashIcon
                          className={clsx(props.className)}
                          weight="fill"
                      />
                  ),
                  clsx: ({ active }) => (active ? 'text-white' : 'text-danger')
              }
          ]
        : [
              {
                  href,
                  text: 'Modifier',
                  Icon: props => (
                      <PencilIcon className={props.className} weight="bold" />
                  )
              },
              {
                  onClick: () => setModalConfirmationOpenState(true),
                  text: 'Supprimer',
                  Icon: props => (
                      <TrashIcon
                          className={clsx(props.className)}
                          weight="fill"
                      />
                  ),
                  clsx: ({ active }) => (active ? 'text-white' : 'text-danger')
              }
          ];

    return (
        <>
            <DeleteConfirmationModal
                title={title.trim()}
                isOpen={isModalConfirmationOpen}
                onClose={() => setModalConfirmationOpenState(false)}
                onConfirm={handleDelete}
            />

            <DashboardPropertyCard
                isDraft={isDraft}
                href={href}
                title={title.trim()}
                customLink={NextLink}
                // @ts-ignore
                customImage={Image}
                {...props}
                actions={actions}
                className="h-full w-full lg:hidden"
                disabled={deletedPropertiesIds.includes(id)}
            />

            <HorizontalDashboardPropertyCard
                {...props}
                disabled={deletedPropertiesIds.includes(id)}
                className={`hidden lg:flex`}
                isDraft={isDraft}
                // @ts-ignore
                customImage={Image}
                customLink={NextLink}
                actions={actions}
                href={href}
                title={title.trim()}
            />
        </>
    );
}
