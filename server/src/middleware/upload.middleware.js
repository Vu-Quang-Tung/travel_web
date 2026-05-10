const multer = require("multer");
const path = require("path");
const fs = require("fs");

/** Cấu hình multer để lưu trữ file */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let folder = "uploads/misc";

        /* Tự động tạo thư mục dựa trên URL */
        if (req.originalUrl.includes("avatars")) {
            folder = "uploads/avatars";
        } else if (req.originalUrl.includes("tour")) {
            folder = "uploads/tours";
        } else if (req.originalUrl.includes("destination")) {
            folder = "uploads/destinations";
        }
        
        fs.mkdirSync(folder, { recursive: true });
        cb(null, folder);
    },

    /* Đặt tên file duy nhất */
    filename: function(req, file, cb) {
        const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

function fileFilter(req, file, cb) {
    /* Chỉ cho phép upload ảnh để tránh nhận file không mong muốn */
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Only image files are allowed"));
    }

    cb(null, true);
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        /* Giới hạn 5MB cho mỗi file upload */
        fileSize: 5 * 1024 * 1024,
    },
});

module.exports = upload;
