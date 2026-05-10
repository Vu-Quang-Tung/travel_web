const db = require("../config/db");
const bcrypt = require("bcryptjs");

/* Lấy thông tin profile của người dùng hiện tại */
exports.getMyProfile = async (req, res) => {
    try {
        const userID = req.user.id;
        const [users] = await db.query(
            `SELECT id, full_name, email, phone, avatar_url, status, role
            FROM users
            WHERE id = ?`,
            [userID]
        );
        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const user = users[0];
        res.json({
             user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                avatar_url: user.avatar_url,
                status: user.status,
                role: user.role
             }
         });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* Cập nhật thông tin profile của người dùng hiện tại */
exports.updateMyProfile = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const userID = req.user.id;
        const { full_name, phone } = req.body;
        await connection.beginTransaction();

        /* Cập nhật thông tin người dùng */
        await connection.query(
            "UPDATE users SET full_name = ?, phone = ? WHERE id = ?",
            [full_name, phone, userID]
        );
        await connection.commit();
        res.json({
            message: "Profile updated successfully",
            user: {
                id: userID,
                full_name: full_name,
                phone: phone
            }
        });
    }
    catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

/* Cập nhật mật khẩu của người dùng hiện tại */
exports.updateMyPassword = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const userID = req.user.id;
        const { current_password, new_password } = req.body;
        await connection.beginTransaction();

        /* Lấy thông tin người dùng */
        const [users] = await connection.query(
            "SELECT password_hash FROM users WHERE id = ?",
            [userID]
        );
        if (users.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "User not found" });
        }
        const user = users[0];
        /* So sánh mật khẩu hiện tại */
        const isPasswordValid = await bcrypt.compare(current_password, user.password_hash);
        if (!isPasswordValid) {
            await connection.rollback();
            return res.status(401).json({ message: "Current password is incorrect" });
        }
        /* Hash mật khẩu mới */
        const newPasswordHash = await bcrypt.hash(new_password, 10);
        /* Cập nhật mật khẩu mới */
        await connection.query(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            [newPasswordHash, userID]
        );
        await connection.commit();
        res.json({ message: "Password updated successfully" });
    }
    catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};
