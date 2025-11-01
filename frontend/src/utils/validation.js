// Validate password strength on frontend
export const validatePassword = (password) => {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password),
  };

  const isStrong = Object.values(checks).every((check) => check);
  const strengthScore = Object.values(checks).filter((check) => check).length;

  return {
    isValid: isStrong,
    checks,
    strength: strengthScore,
    message: isStrong
      ? "Password is strong"
      : "Password must contain uppercase, lowercase, number, and special character",
  };
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
};

// Check if email is valid
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
