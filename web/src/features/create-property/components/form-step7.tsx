import * as React from 'react';
// components
import { CaretDoubleLeft, Check } from 'phosphor-react';
import { Button, DropZone, DropZoneFile } from '@locaci/ui';

// utils
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { createPropertyRequestSchema } from '@web/server/trpc/validation/property-schema';
import { useUploadFileMutation, useZodForm } from '@web/features/shared';
import { getFileExtension } from '@web/utils/functions';
import { env } from '@web/env/client.mjs';

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
    const [files, setFiles] = React.useState<DropZoneFile[]>([]);
    const uploadMutation = useUploadFileMutation('image');
    const isUploadingImages = files.some(f => f.isUploading);

    function handleFileUpload(files: File[]) {
        const filesToAdd = files.map(f => ({
            name: `${uuidv4()}.${getFileExtension(f.name)}`,
            fileObject: f,
            isUploading: true
        }));

        setFiles(oldFiles => [...oldFiles, ...filesToAdd]);

        filesToAdd.forEach(file => {
            uploadMutation
                .mutateAsync({
                    name: file.name,
                    file: file.fileObject
                })
                .then(result => {
                    console.log({ [file.name]: result });

                    form.setValue('images', [
                        ...form.watch('images'),
                        {
                            uri: `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${result.path}`
                        }
                    ]);

                    setFiles(oldFiles => {
                        return [...oldFiles].map(f => {
                            if (f.name === file.name) {
                                f.isUploading = false;
                            }
                            return f;
                        });
                    });
                });
        });
    }

    function handleRemoveFile(file: DropZoneFile) {
        // TODO
    }

    return (
        <>
            <div>
                <h1 className="px-6 text-center text-2xl font-extrabold leading-normal md:text-3xl">
                    Ajoutez les images de votre logement
                </h1>

                <form
                    className="flex flex-col items-stretch gap-4 px-6"
                    onSubmit={form.handleSubmit(variables =>
                        props.onSubmit(variables)
                    )}>
                    <DropZone
                        filesTypesAccepted={`images`}
                        buttonLabel={'Ajouter une photo'}
                        secondLabel={'Faites glisser vos fichiers'}
                        className={`min-h-[400px]`}
                        helpText={
                            'Taille maximum de fichier acceptée : 3 mégabytes'
                        }
                        defaultFiles={files}
                        onRemoveFile={handleRemoveFile}
                        maxFileSize={3_145_728} // 3 mb max
                        onAddFiles={handleFileUpload}
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
                            type="submit"
                            variant="secondary"
                            className="w-full"
                            renderTrailingIcon={cls => (
                                <Check className={cls} />
                            )}>
                            Terminer
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
