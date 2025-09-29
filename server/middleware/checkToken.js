import dbQuery from "../utils/dbQuery.js";

export const authenticate = async (req, res, next) => {
    try {
        const rawSession = req.headers["session"];
        if (!rawSession) {
            return res.status(401).json({ success: false, message: "No session provided" });
        }

        let sessionObj;
        try {
            sessionObj = JSON.parse(rawSession);
        } catch {
            return res.status(400).json({ success: false, message: "Invalid session format" });
        }

        const { uid, Token } = sessionObj;
        if (!uid || !Token) {
            return res.status(401).json({ success: false, message: "Invalid session data" });
        }

        const result = await dbQuery(
            `SELECT * FROM public."sessionData" WHERE uid = $1 AND  session= $2`,
            [uid, Token]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ success: false, message: "Invalid or expired session" });
        }
        next();
    } catch (err) {
        console.error("Auth error:", err.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};