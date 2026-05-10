const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET

/* Tạo JWT chứa thông tin tối thiểu của người dùng */
const generateToken = (payload) => {
    return jwt.sign(payload, secretKey, { expiresIn: '7d' });
};

/* Xác thực token trước khi cho phép truy cập route bảo vệ */
const verifyToken = (token) => {
    return jwt.verify(token, secretKey);
};

module.exports = {
    generateToken,
    verifyToken
};
