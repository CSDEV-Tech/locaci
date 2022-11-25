import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '~/utils/functions';

export function useUploadFileMutation(fileType: 'image' | 'document') {
    return useMutation(async (fileObject: { file: File; name: string }) => {
        const formData = new FormData();
        formData.append(fileObject.name, fileObject.file);
        formData.append('type', fileType);

        return await fetch(`/api/files/upload`, {
            method: 'POST',
            body: formData
        }).then(async res => {
            // the API Response
            const result:
                | {
                      path: null;
                      bucket: null;
                      error: string;
                  }
                | {
                      path: string;
                      bucket: string;
                      error: null;
                  } = await res.json();

            // Get only the result for the file we are uploading
            if (result.error !== null) {
                throw new Error(result.error);
            }

            return result;
        });
    });
}
