import { useMutation } from '@tanstack/react-query';

export function useUploadFileMutation() {
    return useMutation(
        async (fileObject: {
            file: File;
            uploadURL: string;
            extension: string;
        }) => {
            await fetch(fileObject.uploadURL, {
                method: 'PUT',
                body: fileObject.file,
                mode: 'cors',
                headers: {
                    'Content-Type': `image/${fileObject.extension}`
                }
            });
        }
    );
}
