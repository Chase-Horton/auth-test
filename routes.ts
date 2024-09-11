/**
 * An Array of routes that are accessible to the public.
 * these routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = [
    "/",
];
/**
 * An Array of routes that are used for authentication.
 * these routes redirect to settings page
 * @type {string[]}
 */
export const authRoutes = [
    "/login",
    "/register"
];
/**
 * A prefix for the api routes that always need to be available
 * for authentication. 
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/settings";