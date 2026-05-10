const { verifyToken } = require("../utils/jwt");

/* Middleware xác thực JWT */
const authMiddleware = (req, res, next) => {
    try {
        /* Token được gửi theo chuẩn: Authorization: Bearer <token> */
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Authorization header missing or malformed" });
        }
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        /* Gắn thông tin user vào request để controller/middleware sau sử dụng */
        req.user = decoded;
        next();
    } 
    catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
