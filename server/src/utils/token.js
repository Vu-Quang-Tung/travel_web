const crypto = require("crypto");

/* Tao token ngau nhien de gui qua email */
function createRawToken() {
  return crypto.randomBytes(32).toString("hex");
}

/* Chi luu hash cua token trong database, khong luu token that */
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createTokenPair() {
  const rawToken = createRawToken();

  return {
    rawToken,
    tokenHash: hashToken(rawToken),
  };
}

function createExpiryDate(minutes = 30) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

module.exports = {
  createTokenPair,
  createExpiryDate,
  hashToken,
};
