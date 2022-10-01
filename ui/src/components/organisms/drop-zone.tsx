import * as React from 'react';
import {
    Eye,
    FileImage,
    FilePdf,
    UploadSimple,
    WarningCircle,
    X
} from 'phosphor-react';
import { clsx } from '../../lib/functions';
import { useDropzone } from 'react-dropzone';
import { Button } from '../atoms/button';
import { Modal } from '../atoms/modal';
import { LoadingIndicator } from '../atoms/loading-indicator';

export const fileExtensionsTypes = {
    'image/*': ['.png', '.jpeg', '.jpg', '.webp'],
    'application/pdf': ['.pdf']
};

// either a list of URLs or a list of files (mostly in memory files)
export type DropZoneFile = {
    name: string;
    fileObject: File | { uri: string; fileType: 'image' | 'document' };
    state: 'UPLOADING' | 'ERROR' | 'SUCCESS';
};

export type DropZoneProps = {
    buttonLabel: string;
    secondLabel: string;
    variant?: 'primary' | 'secondary';
    className?: string;
    onAddFiles: (files: File[]) => void;
    maxNumberOfFiles?: number;
    errorText?: string;
    helpText?: string;
    filesTypesAccepted?: 'images' | 'documents' | 'all';
    defaultFiles?: Array<DropZoneFile>;
    onRemoveFile?: (file: DropZoneFile) => void;
    onReuploadFile?: (file: DropZoneFile) => void;
    maxFileSize?: number;
};

export function DropZone({
    className,
    buttonLabel,
    secondLabel,
    onAddFiles,
    errorText,
    helpText,
    onRemoveFile,
    onReuploadFile,
    defaultFiles = [],
    maxFileSize = 20_971_520, // 20 megabytes by default
    filesTypesAccepted = 'all',
    maxNumberOfFiles = Infinity,
    variant = 'primary'
}: DropZoneProps) {
    const onDropAccepted = React.useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        onAddFiles(acceptedFiles);
    }, []);

    // get the accepted files
    let accepted: Partial<typeof fileExtensionsTypes> = {};
    if (filesTypesAccepted === 'images') {
        accepted['image/*'] = fileExtensionsTypes['image/*'];
    } else if (filesTypesAccepted === 'documents') {
        accepted['application/pdf'] = fileExtensionsTypes['application/pdf'];
    } else {
        accepted = fileExtensionsTypes;
    }

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
        useDropzone({
            onDropAccepted,
            accept: accepted,
            maxFiles: maxNumberOfFiles,
            maxSize: maxFileSize
        });

    // input & label ids for accessibility
    const inputId = React.useId();
    const errorId = React.useId();
    const helpId = React.useId();

    // the file selected
    const [currentEnlargedFile, setCurrentEnlargedFile] =
        React.useState<DropZoneFile | null>(null);

    return (
        <div className={`flex flex-col gap-2`}>
            {/* the modal where the enlarged file is shown */}
            <Modal
                title={currentEnlargedFile?.name ?? ''}
                isOpen={currentEnlargedFile !== null}
                onClose={() => setCurrentEnlargedFile(null)}>
                <EnlargedFile file={currentEnlargedFile} />
            </Modal>

            {/*the dropzone*/}
            <div
                {...getRootProps()}
                className={clsx(
                    className,
                    `cursor-pointer`,
                    `flex flex-col items-center gap-4`,
                    `rounded-md border-2 border-dashed p-4`,
                    {
                        ring: isDragActive,
                        'ring-primary': isDragActive && variant === 'primary',
                        'ring-secondary':
                            isDragActive && variant === 'secondary',
                        'border-red-400': !!errorText,
                        'border-gray/30': !errorText,
                        'focus-within:ring-2 focus-within:ring-red-400':
                            !!errorText,
                        'focus-within:ring-2 focus-within:ring-gray/50':
                            !errorText,
                        'justify-center': defaultFiles?.length === 0
                    }
                )}>
                {defaultFiles?.length > 0 && (
                    <div
                        className={clsx(
                            'grid w-full grid-cols-[repeat(auto-fit,minmax(150px,_1fr))] gap-4'
                        )}>
                        {defaultFiles?.map(file => (
                            <FileElement
                                file={file}
                                key={file.name}
                                onRemoveFile={() => onRemoveFile?.(file)}
                                onEnlarge={() => setCurrentEnlargedFile(file)}
                                onReuploadFile={() => onReuploadFile?.(file)}
                            />
                        ))}
                    </div>
                )}

                <label
                    htmlFor={inputId}
                    className={clsx(`flex flex-col gap-4`)}>
                    <Button
                        type={`button`}
                        renderLeadingIcon={cls => (
                            <UploadSimple className={cls} />
                        )}>
                        {buttonLabel}
                    </Button>

                    <div
                        className={clsx(
                            'my-2 hidden items-center gap-2 lg:flex',
                            {
                                'sr-only': defaultFiles?.length > 0
                            }
                        )}>
                        <hr className="h-[1px] w-full bg-lightgray" />
                        <span className="text-gray">Ou</span>
                        <hr className="h-[1px] w-full bg-lightgray" />
                    </div>

                    <p
                        className={clsx(
                            `hidden text-center text-gray lg:block`,
                            {
                                'sr-only': defaultFiles?.length > 0
                            }
                        )}>
                        {secondLabel}
                    </p>
                </label>

                <input
                    {...getInputProps()}
                    id={inputId}
                    aria-describedby={`${errorId} ${helpId}`}
                />
            </div>

            {errorText && (
                <small
                    id={errorId}
                    role={`alert`}
                    className={`text-red-500`}
                    aria-live={`assertive`}>
                    {errorText}
                </small>
            )}

            {helpText && (
                <small id={helpId} className={`text-gray`}>
                    {helpText}
                </small>
            )}
        </div>
    );
}

export function isNativeFile(
    fileObject: File | { uri: string; fileType: 'image' | 'document' }
): fileObject is File {
    return fileObject instanceof File;
}

export function EnlargedFile({ file }: { file: DropZoneFile | null }) {
    const [fileSrcLoaded, setFileSrcLoaded] = React.useState<string | null>(
        null
    );

    if (!file) {
        return <></>;
    }

    if (isNativeFile(file.fileObject)) {
        const fReader = new FileReader();

        fReader.onload = e => {
            setFileSrcLoaded(e.target?.result as string);
        };
        fReader.readAsDataURL(file.fileObject);
    }

    return (
        <>
            {isNativeFile(file.fileObject) ? (
                <>
                    {file.fileObject.type.startsWith(`image`) ? (
                        fileSrcLoaded ? (
                            <img
                                src={fileSrcLoaded}
                                alt={file.name}
                                className={`h-full w-full rounded-lg object-cover object-center`}
                            />
                        ) : (
                            <div
                                className={`flex h-full w-full items-center justify-center rounded-lg border border-gray`}>
                                <div className="flex flex-col items-center gap-2">
                                    <FileImage className={`h-10 w-10`} />
                                    <span>{file.name}</span>
                                </div>
                            </div>
                        )
                    ) : fileSrcLoaded ? (
                        <object
                            type="application/pdf"
                            className={`flex h-[400px] w-full items-center justify-center rounded-lg border border-gray`}
                            data={fileSrcLoaded}
                        />
                    ) : (
                        <div
                            className={`flex h-full w-full items-center justify-center rounded-lg border border-gray`}>
                            <div className="flex flex-col items-center gap-2">
                                <FilePdf className={`h-10 w-10`} />
                                <span>{file.name}</span>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {file.fileObject.fileType === 'image' ? (
                        <img
                            src={file.fileObject.uri}
                            alt={file.name}
                            className={`h-full w-full rounded-lg object-cover object-center`}
                        />
                    ) : (
                        <object
                            type="application/pdf"
                            className={`flex h-[400px] w-full items-center justify-center rounded-lg border border-gray`}
                            data={file.fileObject.uri}
                        />
                    )}
                </>
            )}
        </>
    );
}

export function FileElement({
    file,
    onRemoveFile,
    onEnlarge,
    onReuploadFile
}: {
    file: DropZoneFile;
    onRemoveFile?: () => void;
    onEnlarge?: () => void;
    onReuploadFile?: () => void;
}) {
    const [imgSrcLoaded, setImgSrcLoaded] = React.useState<string | null>(null);

    // Read the dom file
    if (isNativeFile(file.fileObject)) {
        const fReader = new FileReader();

        fReader.onload = e => {
            setImgSrcLoaded(e.target?.result as string);
        };
        fReader.readAsDataURL(file.fileObject);
    }

    return (
        <div
            className={`group relative h-[150px] overflow-hidden rounded-lg bg-lightgray/20`}>
            {/* Close Button */}
            {file.state !== 'UPLOADING' && (
                <Button
                    variant="hollow"
                    className="absolute right-2 top-2 z-10"
                    square
                    type={`button`}
                    aria-label={`Retirer le fichier`}
                    onClick={e => {
                        e.stopPropagation();
                        onRemoveFile?.();
                    }}
                    renderLeadingIcon={cls => <X className={cls} />}
                />
            )}

            {/* Uploading State */}
            {file.state === 'UPLOADING' && (
                <div
                    onClick={e => {
                        e.stopPropagation();
                    }}
                    className={clsx(
                        `absolute inset-0 w-full p-2`,
                        `flex items-center justify-center`,
                        `bg-lightgray/40`,
                        `filter backdrop-blur-sm`,
                        `cursor-default rounded-lg`
                    )}>
                    <div className="flex flex-col items-center gap-2">
                        <LoadingIndicator className={`h-10 w-10`} />
                        <span className={`text-center`}>{file.name}</span>
                    </div>
                </div>
            )}

            {/* Error State */}
            {file.state === 'ERROR' && (
                <button
                    type={`button`}
                    aria-label={`Voir le fichier en plus grand`}
                    className={clsx(
                        `absolute inset-0 w-full p-2`,
                        `flex flex-col items-center justify-center gap-4`,
                        `border border-danger bg-danger/60`,
                        `text-center filter backdrop-blur-sm`,
                        `rounded-lg`
                    )}
                    onClick={e => {
                        e.stopPropagation();
                        onReuploadFile?.();
                    }}>
                    <div
                        className={clsx(
                            `rounded-full bg-danger p-2 text-white opacity-100`
                        )}>
                        <WarningCircle className={`h-5 w-5`} />
                    </div>

                    <span className={`text-white`}>
                        Une erreur est survenue ! cliquez pour réessayer
                    </span>
                </button>
            )}

            {/* Normal State */}
            {file.state === 'SUCCESS' && (
                <button
                    type={`button`}
                    aria-label={`Voir le fichier en plus grand`}
                    className={clsx(
                        `absolute inset-0 w-full p-2`,
                        `hidden items-center justify-center group-hover:flex`,
                        `bg-lightgray/40`,
                        `filter backdrop-blur-sm`,
                        `rounded-lg`
                    )}
                    onClick={e => {
                        e.stopPropagation();
                        onEnlarge?.();
                    }}>
                    <div
                        className={clsx(
                            `rounded-full bg-lightgray p-2 opacity-100`
                        )}>
                        <Eye className={`h-5 w-5`} />
                    </div>
                </button>
            )}

            {/* If the file is dom File Object */}
            {isNativeFile(file.fileObject) ? (
                <>
                    {file.fileObject.type.startsWith(`image`) ? (
                        imgSrcLoaded ? (
                            <img
                                src={imgSrcLoaded}
                                alt={file.name}
                                className={`h-full w-full rounded-lg object-cover object-center`}
                            />
                        ) : (
                            <div
                                className={`flex h-full w-full items-center justify-center rounded-lg border border-gray`}>
                                <div className="flex flex-col items-center gap-2">
                                    <FileImage
                                        className={clsx(`h-10 w-10`, {
                                            hidden: file.state === 'UPLOADING'
                                        })}
                                    />
                                    <span className={`text-center`}>
                                        {file.name}
                                    </span>
                                </div>
                            </div>
                        )
                    ) : (
                        <div
                            className={`flex h-full w-full items-center justify-center rounded-lg border border-gray`}>
                            <div className="flex flex-col items-center gap-2">
                                <FilePdf
                                    className={clsx(`h-10 w-10`, {
                                        hidden: file.state === 'UPLOADING'
                                    })}
                                />
                                <span className={`text-center`}>
                                    {file.name}
                                </span>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {/* If the file is a URI */}
                    {file.fileObject.fileType === 'image' ? (
                        <img
                            src={file.fileObject.uri}
                            alt={file.name}
                            className={`h-full w-full rounded-lg object-cover object-center`}
                        />
                    ) : (
                        <div
                            className={`flex h-full w-full items-center justify-center rounded-lg border border-gray`}>
                            <div className="flex flex-col items-center gap-2">
                                <FilePdf
                                    className={clsx(`h-10 w-10`, {
                                        hidden: file.state === 'UPLOADING'
                                    })}
                                />
                                <span>{file.name}</span>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
