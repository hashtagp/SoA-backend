import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;

        // Check if token is provided
        if (!token) {
            return res.status(401).json({ success: false, message: "Access denied. No token provided." });
        }

        if(req.path==="/api/verify"){
            return res.status(200).json({ success: true, message: "Token is valid." });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user data to request object
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid or expired token." });
    }
};

export default authMiddleware;