'use client';
import * as React from 'react';

// components
import {
    DashboardPropertyCard,
    HorizontalDashboardPropertyCard
} from '@locaci/ui/components/molecules/dashboard-property-card';
import { NextLink } from '~/features/shared/components/next-link';
import Image from 'next/image';
import {
    Copy,
    Eye,
    EyeSlash,
    Link,
    PencilSimple,
    TrashSimple
} from 'phosphor-react';
import { DropdownItem } from '@locaci/ui/components/molecules/dropdown';
import { DeleteConfirmationModal } from './delete-confirmation-modal';

// utils
import { clsx } from '@locaci/ui/lib/functions';
import { t } from '~/utils/trpc-rq-hooks';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Uuid } from '~/utils/uuid';

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
                      <Link className={props.className} weight="bold" />
                  )
              },
              {
                  href,
                  text: 'Modifier',
                  Icon: props => (
                      <PencilSimple className={props.className} weight="bold" />
                  )
              },
              {
                  onClick() {
                      toggleVisibility({ uid: id });
                  },
                  text: props.isActiveForListing ? 'Dépublier' : 'Publier',
                  Icon: ({ className }) =>
                      props.isActiveForListing ? (
                          <EyeSlash className={className} weight="fill" />
                      ) : (
                          <Eye className={className} weight="bold" />
                      )
              },
              {
                  onClick() {
                      duplicateProperty({ uid: id });
                  },
                  text: 'Dupliquer',
                  Icon: props => (
                      <Copy className={props.className} weight="bold" />
                  )
              },
              {
                  onClick: () => setModalConfirmationOpenState(true),
                  text: 'Supprimer',
                  Icon: props => (
                      <TrashSimple
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
                      <PencilSimple className={props.className} weight="bold" />
                  )
              },
              {
                  onClick: () => setModalConfirmationOpenState(true),
                  text: 'Supprimer',
                  Icon: props => (
                      <TrashSimple
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
