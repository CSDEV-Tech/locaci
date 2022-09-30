import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
    if (!(req.method === 'DELETE')) {
        // Method not allowed
        return res.status(405);
    }

    return res.status(200).json({ success: true });
};

export default handler;
