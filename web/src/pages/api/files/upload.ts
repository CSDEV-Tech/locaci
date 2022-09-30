import type { NextApiHandler } from 'next';
import type { Files, Fields } from 'formidable';

import formidable from 'formidable';
import { supabaseAdmin } from '@web/utils/supabase-admin';
import { promises as fs } from 'node:fs';
import { z } from 'zod';

// Deactivate NextJs default body parser because it cannot parse incoming files
export const config = {
    api: {
        bodyParser: false
    }
};

const fileUploadSchema = z.object({
    type: z.enum(['image', 'document'])
});

/**
 * Endpoint to upload a file
 *
 * @param req
 * @param res
 */
const handler: NextApiHandler = async (req, res) => {
    if (!(req.method === 'POST')) {
        // Method not allowed
        return res.status(405);
    }

    const form = new formidable.IncomingForm();
    // @ts-ignore
    return new Promise<{ files: Files; fields: Fields }>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
                return;
            }

            resolve({ files, fields });
        });
    })
        .then(async ({ files, fields }) => {
            try {
                // determine the supabase storage bucket where we will upload the files
                const parse = fileUploadSchema.safeParse(fields);
                if (!parse.success) {
                    throw parse.error.flatten().fieldErrors;
                }

                const bucket =
                    parse.data.type === 'image' ? 'images' : 'documents';
                const isPublic = parse.data.type === 'image'; // only the image bucket is public

                const result = await supabaseAdmin.storage.getBucket(bucket);
                // if the bucket does not exist, we create it
                if (result.error) {
                    await supabaseAdmin.storage.createBucket(bucket, {
                        public: isPublic
                    });
                }

                const supabaseStorageResult: Record<
                    string,
                    {
                        path: string | null;
                        error: any;
                    }
                > = {};

                for (const [fileKey, file] of Object.entries(files)) {
                    if (!(file instanceof Array)) {
                        // we read the file before uploading it
                        const buffer = await fs.readFile(file.filepath);

                        // we upload the files
                        const { data: fileEl, error } =
                            await supabaseAdmin.storage
                                .from(bucket)
                                .upload(fileKey, buffer, {
                                    cacheControl: '84600', // 1 day
                                    upsert: false,
                                    contentType: file.mimetype!
                                });

                        supabaseStorageResult[fileKey] = {
                            path: `images/${fileEl?.path}` ?? null,
                            error
                        };
                    }
                }

                return res.status(200).json({ ...supabaseStorageResult });
            } catch (e) {
                console.log({ e });
                return res.status(400).json({ success: false, error: e });
            }
        })
        .catch(err => {
            console.log({ err });
            return res.status(400).json({ success: false, error: err });
        });
};

export default handler;
