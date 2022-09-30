import { useMutation } from '@tanstack/react-query';
import { jsonFetch } from '@web/utils/functions';

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
            const result: Record<
                string,
                | {
                      path: null;
                      error: string;
                  }
                | {
                      path: string;
                      error: null;
                  }
            > = await res.json();

            // Get only the result for the file we are uploading
            const fileResult = result[fileObject.name];

            if (fileResult.error !== null) {
                throw new Error(fileResult.error);
            }

            return fileResult;
        });
    });
}
