'use client';
import * as React from 'react';
// components
import { CaretDoubleLeft, CaretDoubleRight } from 'phosphor-react';
import { Button } from '@locaci/ui/components/atoms/button';
import {
    DropZone,
    type DropZoneFile
} from '@locaci/ui/components/organisms/drop-zone';

// utils
import { updatePropertyStep7Schema } from '~/validation/property-schema';
import { useZodForm } from '~/features/shared/hooks/use-zod-form';
import { useUploadFileMutation } from '~/features/shared/hooks/use-upload-image-mutation';
import { getFileExtension, isNativeDOMFile } from '~/utils/functions';
import { env } from '~/env/client.mjs';
import { t } from '~/app/trpc-client-provider';
import { Uuid } from '~/utils/uuid';

// types
import type { z } from 'zod';
export type Form7Values = Omit<
    z.TypeOf<typeof updatePropertyStep7Schema>,
    'uid'
>;
export type FormStep7Props = {
    onPreviousClick: () => void;
    onSubmit: (values: Form7Values) => void;
    defaultValues: Partial<Form7Values>;
    isSubmitting: boolean;
};

export function FormStep7(props: FormStep7Props) {
    const form = useZodForm({
        schema: updatePropertyStep7Schema.omit({
            uid: true
        }),
        defaultValues: {
            images: props.defaultValues.images ?? []
        }
    });

    // manage the state of dropzone files
    const [files, setFiles] = React.useState<DropZoneFile[]>(
        props.defaultValues.images?.map(img => ({
            name: img.path,
            fileObject: {
                uri: img.uri,
                fileType: 'image'
            },
            state: 'SUCCESS'
        })) ?? []
    );
    const isUploadingImages = files.some(f => f.state === 'UPLOADING');

    // mutations
    const { mutateAsync: uploadImage } = useUploadFileMutation();

    const utils = t.useContext();

    async function uploadFile(file: { name: string; fileObject: File }) {
        setFiles(oldFiles => {
            return [...oldFiles].map(f => {
                if (f.name === file.name) {
                    f.state = 'UPLOADING';
                }
                return f;
            });
        });
        try {
            // upload file to api route
            const { url: presignedURL } =
                await utils.owner.storage.generatePresignedURLForImage.fetch({
                    name: file.name
                });
            await uploadImage({
                file: file.fileObject,
                uploadURL: presignedURL,
                extension: getFileExtension(file.name)
            });

            const imgURI = `${env.NEXT_PUBLIC_CF_IMAGES_URL}/${file.name}`;
            form.setValue('images', [
                ...form.getValues('images'),
                {
                    uri: imgURI,
                    path: file.name
                }
            ]);

            setFiles(oldFiles => {
                return [...oldFiles].map(f => {
                    if (f.name === file.name) {
                        f.state = 'SUCCESS';
                        f.fileObject = {
                            uri: imgURI,
                            fileType: 'image'
                        };
                    }
                    return f;
                });
            });
        } catch (error) {
            console.error(error);

            setFiles(oldFiles => {
                return [...oldFiles].map(f => {
                    if (f.name === file.name) {
                        f.state = 'ERROR';
                    }
                    return f;
                });
            });
        }
    }

    function handleFileUpload(files: File[]) {
        const filesToAdd = files.map(f => ({
            name: `${new Uuid().short()}.${getFileExtension(f.name)}`,
            fileObject: f,
            state: 'UPLOADING' as const // this is necessary for typescript ...
            // => to infer the state attribute as "UPLOADING" instead of just string
        }));

        setFiles(oldFiles => [...oldFiles, ...filesToAdd]);
        filesToAdd.forEach(uploadFile);
    }

    async function handleRemoveFile(file: DropZoneFile) {
        setFiles(oldFiles => [...oldFiles].filter(f => f.name !== file.name));

        const fileObject = file.fileObject;

        if (!isNativeDOMFile(fileObject)) {
            // Find the corresponding image saved in form State
            const image = form
                .watch('images')
                .find(img => img.uri === fileObject.uri);

            if (image) {
                form.setValue(
                    'images',
                    form
                        .watch('images')
                        .filter(img => img.uri !== fileObject.uri)
                );
            }
        }
    }

    return (
        <>
            <div>
                <h2 className="text-center text-2xl font-bold text-secondary">
                    7/8
                </h2>
                <h1 className="px-6 text-center text-2xl font-bold leading-normal md:text-3xl">
                    Ajoutez les images de votre logement
                </h1>
            </div>

            <form
                className="flex flex-col items-stretch gap-4 px-6 md:m-auto md:w-[800px]"
                onSubmit={form.handleSubmit(variables =>
                    props.onSubmit(variables)
                )}>
                <DropZone
                    filesTypesAccepted={`images`}
                    buttonLabel={'Cliquez pour ajouter une photo'}
                    secondLabel={'Faites glisser vos fichiers'}
                    className={`min-h-[400px]`}
                    helpText={
                        'Taille maximum de fichier acceptée : 3 mégabytes'
                    }
                    defaultFiles={files}
                    onRemoveFile={handleRemoveFile}
                    maxFileSize={3_145_728} // 3 mb max
                    onAddFiles={handleFileUpload}
                    onReuploadFile={f =>
                        uploadFile({
                            ...f,
                            fileObject: f.fileObject as File
                        })
                    }
                    errorText={form.formState.errors.images?.message}
                />

                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="hollow"
                        className="w-full"
                        onClick={props.onPreviousClick}
                        renderLeadingIcon={cls => (
                            <CaretDoubleLeft className={cls} />
                        )}>
                        Précédent
                    </Button>

                    <Button
                        loading={isUploadingImages || props.isSubmitting}
                        loadingMessage={`Veuillez attendre l'envoi des images avant de passer à la suite`}
                        type="submit"
                        variant="dark"
                        className="w-full"
                        renderTrailingIcon={cls => (
                            <CaretDoubleRight className={cls} />
                        )}>
                        Suivant
                    </Button>
                </div>
            </form>
        </>
    );
}
