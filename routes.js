/**
 * An array of routes that are accessible to the public.
 * These routes are public and do not require authentication.
 * @type {string[]}
 * @author Prince Jain
 */
export const publicRoutes = ["/", "/verify-otp", "/verify"];

/**
 * An array of routes that are for login and registration.
 * These routes are public and for authentication purpose.
 * @type {string[]}
 * @author Prince Jain
 */
export const authRoutes = [
  "/login",
  "/register",
  "/error",
  "/forgot-password",
  "/new-password",
];

/**
 * The prefix for API authentication routes.
 * This routes will used by logged-in user.
 * @type {string[]}
 * @author Prince Jain
 */
export const apiAuthPrefix = ["/api/auth"];

/**
 * The default redirect path after successfull logging
 * @type {string}
 * @author Prince Jain
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
