const db = require("../config/db");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const { sendActionEmail } = require("../utils/mail");
const { createExpiryDate, createTokenPair, hashToken } = require("../utils/token");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

function validateRegisterPayload({ full_name, email, password }) {
  if (!full_name || !email || !password) {
    return "All fields are required";
  }

  return null;
}

function validateLoginPayload({ email, password }) {
  if (!email || !password) {
    return "Email and password are required";
  }

  return null;
}

function validateResetPasswordPayload({ token, password }) {
  if (!token || !password) {
    return "Token and password are required";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
}

function buildAuthUser(user) {
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone || null,
    role: user.role,
  };
}

function buildTokenPayload(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

async function findUserByEmail(connection, email) {
  const [users] = await connection.query(
    `SELECT
       id,
       full_name,
       email,
       phone,
       password_hash,
       status,
       role,
       email_verified
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email]
  );

  return users[0] || null;
}

async function sendVerificationEmail(email, rawToken) {
  const actionUrl = `${CLIENT_URL}/verify-email?token=${rawToken}`;

  await sendActionEmail({
    to: email,
    subject: "Verify your Travel Web account",
    text: "Click the link below to verify your email address.",
    actionUrl,
  });
}

async function sendPasswordResetEmail(email, rawToken) {
  const actionUrl = `${CLIENT_URL}/reset-password?token=${rawToken}`;

  await sendActionEmail({
    to: email,
    subject: "Reset your Travel Web password",
    text: "Click the link below to set a new password.",
    actionUrl,
  });
}

/* Dang ky tai khoan moi va gui email xac minh */
exports.register = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { full_name, email, phone, password } = req.body;
    const validationError = validateRegisterPayload({ full_name, email, password });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingUser = await findUserByEmail(connection, email);

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { rawToken, tokenHash } = createTokenPair();
    const tokenExpires = createExpiryDate(60);

    await connection.query(
      `INSERT INTO users (
        full_name,
        email,
        password_hash,
        phone,
        email_verified,
        email_verify_token_hash,
        email_verify_expires,
        status,
        role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email, hashedPassword, phone || null, 0, tokenHash, tokenExpires, "active", "customer"]
    );

    await sendVerificationEmail(email, rawToken);

    res.status(201).json({
      message: "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

/* Xac minh email bang token trong link */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const tokenHash = hashToken(token);
    const [result] = await db.query(
      `UPDATE users
       SET email_verified = 1,
           email_verify_token_hash = NULL,
           email_verify_expires = NULL
       WHERE email_verify_token_hash = ?
         AND email_verify_expires > NOW()`,
      [tokenHash]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    res.json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Gui lai email xac minh cho tai khoan chua verify */
exports.resendVerificationEmail = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await findUserByEmail(connection, email);

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    if (Number(user.email_verified) === 1) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const { rawToken, tokenHash } = createTokenPair();
    const tokenExpires = createExpiryDate(60);

    await connection.query(
      `UPDATE users
       SET email_verify_token_hash = ?,
           email_verify_expires = ?
       WHERE id = ?`,
      [tokenHash, tokenExpires, user.id]
    );

    await sendVerificationEmail(email, rawToken);

    res.json({ message: "Verification email has been sent." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

/* Dang nhap bang email/password va tao JWT cho frontend luu tru */
exports.login = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { email, password } = req.body;
    const validationError = validateLoginPayload({ email, password });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const user = await findUserByEmail(connection, email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ message: "User account is not active" });
    }

    if (Number(user.email_verified) !== 1) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const authUser = buildAuthUser(user);
    const token = generateToken(buildTokenPayload(authUser));

    res.json({
      message: "Login successful",
      token,
      user: authUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

/* Tao token reset mat khau dang hash va gui link qua email */
exports.forgotPassword = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await findUserByEmail(connection, email);

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const { rawToken, tokenHash } = createTokenPair();
    const tokenExpires = createExpiryDate(30);

    await connection.query(
      `UPDATE users
       SET password_reset_token_hash = ?,
           password_reset_expires = ?
       WHERE id = ?`,
      [tokenHash, tokenExpires, user.id]
    );

    await sendPasswordResetEmail(email, rawToken);

    res.json({ message: "Password reset link has been sent to your email." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

/* Dat mat khau moi bang token reset hop le */
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const validationError = validateResetPasswordPayload({ token, password });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const tokenHash = hashToken(token);
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `UPDATE users
       SET password_hash = ?,
           password_reset_token_hash = NULL,
           password_reset_expires = NULL
       WHERE password_reset_token_hash = ?
         AND password_reset_expires > NOW()`,
      [hashedPassword, tokenHash]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    res.json({ message: "Password has been reset successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
