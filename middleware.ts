import NextAuth from "next-auth";
import authConfig from "./auth.config";

const {auth} = NextAuth(authConfig);
export default auth ((req) => {
    let isLoggedIn = !!req.auth;
    console.log("ROUTE: ", req.nextUrl.pathname)
    console.log("LOGGED IN: ", isLoggedIn)
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}