// Double-submit CSRF middleware
// Checks that for unsafe methods (POST, PUT, PATCH, DELETE) the header 'x-xsrf-token'
// matches the readable cookie 'XSRF-TOKEN'.

export const csrfMiddleware = (req, res, next) => {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // Skip CSRF for authenticated API routes (home, about, projects) as they use JWT auth
  const skipCsrfPaths = [
    "/api/home",
    "/api/about",
    "/api/projects",
    "/api/upload"
  ];
  if (skipCsrfPaths.some((p) => req.path.startsWith(p))) {
    return next();
  }

  // Read cookie token and header token
  const cookieToken = req.cookies?.["XSRF-TOKEN"];
  const headerToken = req.get("x-xsrf-token") || req.get("x-csrf-token");

  // Allow unauthenticated public auth endpoints (signup/login/verify/forgot/reset)
  // because the client won't have XSRF cookie yet when creating account or logging in.
  const publicPaths = [
    "/api/auth/signup",
    "/api/auth/login",
    "/api/auth/verify-email",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
  ];
  if (!cookieToken && publicPaths.some((p) => req.path.startsWith(p))) {
    return next();
  }

  if (!cookieToken || !headerToken) {
    return res
      .status(403)
      .json({ success: false, message: "CSRF token missing or invalid" });
  }

  if (cookieToken !== headerToken) {
    return res
      .status(403)
      .json({ success: false, message: "CSRF token mismatch" });
  }

  // tokens match
  next();
};
