/**
 * Sanitize user object untuk response
 * Remove semua sensitive fields (password, tokens, etc)
 *
 * ℹ️ ABOUT _id EXPOSURE:
 * - ✅ _id AMAN untuk di-expose karena:
 *   1. Bukan secret - public identifier
 *   2. Sudah terexpose di database
 *   3. Frontend butuh untuk operations
 *   4. Standard practice dalam REST APIs
 *
 * - ⚠️ TAPI harus paired dengan:
 *   1. JWT validation - ensure user hanya access own data
 *   2. Ownership checks - verify req.userId === targetUserId
 *   3. Rate limiting - prevent brute force ID guessing
 *   4. Generic error messages - prevent user enumeration
 *
 * @param {Object} user - User document dari database
 * @param {Object} options - Configuration options
 * @param {boolean} options.excludeId - Exclude _id dari response (default: false)
 * @returns {Object} Sanitized user object
 */
export const sanitizeUser = (user, options = {}) => {
  if (!user) return null;

  const { excludeId = false } = options;

  // Jika user adalah Mongoose document, convert ke plain object
  const userObj = user._doc || user.toObject?.() || user;

  // WHITELIST approach - ONLY include safe fields
  const safeUser = {
    email: userObj.email,
    name: userObj.name,
    isVerified: userObj.isVerified,
    createdAt: userObj.createdAt,
    lastLogin: userObj.lastLogin,
  };

  // Include _id unless explicitly excluded
  if (!excludeId) {
    safeUser._id = userObj._id;
  }

  // DEFENSIVE: Blacklist dangerous fields yang mungkin tercopy
  // This catches any fields yang accidentally included
  delete safeUser.password;
  delete safeUser.verificationToken;
  delete safeUser.verificationTokenExpiresAt;
  delete safeUser.resetPasswordToken;
  delete safeUser.resetPasswordExpiresAt;
  delete safeUser.__v; // Mongoose version field
  delete safeUser.updatedAt; // Not needed

  return safeUser;
};

/**
 * Sanitize multiple users
 * @param {Array} users - Array of user documents
 * @param {Object} options - Same options as sanitizeUser
 * @returns {Array} Array of sanitized user objects
 */
export const sanitizeUsers = (users, options = {}) => {
  if (!Array.isArray(users)) return [];
  return users.map((user) => sanitizeUser(user, options));
};
