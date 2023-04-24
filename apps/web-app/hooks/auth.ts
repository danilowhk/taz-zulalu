import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

const authMiddleware = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    // Validate the API key
    const apiKey = req.headers["x-api-key"]
    if (apiKey !== process.env.KEY_TO_API) {
        return res.status(403).json({ message: "Forbidden" })
    }

    // You can also validate other headers if necessary
    const type = req.headers["x-api-type"]

    return handler(req, res)
}

export default authMiddleware
