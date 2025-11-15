// Double-submit CSRF middleware
// Checks that for unsafe methods (POST, PUT, PATCH, DELETE) the header 'x-xsrf-token'
// matches the readable cookie 'XSRF-TOKEN'.

export const csrfMiddleware = (req, res, next) => {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // Skip CSRF for all auth routes as they handle authentication
  const skipCsrfPaths = [
    "/api/auth",
    "/api/home",
    "/api/about",
    "/api/projects",
    "/api/upload",
  ];
  if (skipCsrfPaths.some((p) => req.path.startsWith(p))) {
    return next();
  }

  // Read cookie token and header token
  const cookieToken = req.cookies?.["XSRF-TOKEN"];
  const headerToken = req.get("x-xsrf-token") || req.get("x-csrf-token");

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
