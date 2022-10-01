import * as React from 'react';
// components
import { CaretDoubleLeft, Check } from 'phosphor-react';
import { Button, DropZone, DropZoneFile } from '@locaci/ui';

// utils
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { createPropertyRequestSchema } from '@web/server/trpc/validation/property-schema';
import { useUploadFileMutation, useZodForm } from '@web/features/shared';
import { getFileExtension, isNativeDOMFile } from '@web/utils/functions';
import { env } from '@web/env/client.mjs';
import { t } from '@web/utils/trpc-rq-hooks';

// types
export type Form7Values = Pick<
    z.TypeOf<typeof createPropertyRequestSchema>,
    'images'
>;
export type FormStep7Props = {
    onPreviousClick: () => void;
    onSubmit: (values: Form7Values) => void;
    defaultValues: Partial<Form7Values>;
};

export function FormStep7(props: FormStep7Props) {
    const form = useZodForm({
        schema: createPropertyRequestSchema.pick({
            images: true
        }),
        defaultValues: {
            images: [],
            ...props.defaultValues
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
    const uploadMutation = useUploadFileMutation('image');
    const deleteMutation = t.owner.property.deleteFile.useMutation();

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
            const result = await uploadMutation.mutateAsync({
                name: file.name,
                file: file.fileObject
            });

            const imgURI = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${result.bucket}/${result.path}`;
            form.setValue('images', [
                ...form.watch('images'),
                {
                    uri: imgURI,
                    path: result.path
                }
            ]);

            // automatically save the images to the parent form state
            props.onSubmit({
                images: form.watch('images')
            });

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
            name: `${uuidv4()}.${getFileExtension(f.name)}`,
            fileObject: f,
            state: 'UPLOADING' as const // this is necessary for typescript ...
            // => to infer the state attribute as "UPLOADING" instead of string
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

                await deleteMutation.mutateAsync({
                    path: image.path,
                    type: fileObject.fileType
                });

                // automatically save the images to the parent form state
                props.onSubmit({
                    images: form.watch('images')
                });
            }
        }
    }

    return (
        <>
            <div>
                <h1 className="px-6 text-center text-2xl font-extrabold leading-normal md:text-3xl">
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
                        loading={isUploadingImages}
                        loadingMessage={`Veuillez attendre l'envoi des images avant de passer à la suite`}
                        type="submit"
                        variant="secondary"
                        className="w-full"
                        renderTrailingIcon={cls => <Check className={cls} />}>
                        Terminer
                    </Button>
                </div>
            </form>
        </>
    );
}
