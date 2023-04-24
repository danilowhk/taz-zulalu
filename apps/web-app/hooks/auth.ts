import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

const authMiddleware = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    // const apiKey = req.headers["x-api-key"]
    const apiKey = req.headers["x-api-key"]
    const type = req.headers["x-api-type"]

    if (apiKey !== process.env.KEY_TO_API) {
        return res.status(403).json({ message: "Forbidden" })
    }

    return handler(req, res)
}

export default authMiddleware
