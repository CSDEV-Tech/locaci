// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'web/src/utils/supabase-client';

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
    supabase.auth.api.setAuthCookie(req, res);
    res.status(200).json({
        success: true
    });
};

export default examples;
