import NextAuth from "next-auth";
import authConfig from "./auth.config";

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes"
import { NextResponse } from "next/server";

const {auth} = NextAuth(authConfig);
export default auth ((req) => {
    const {nextUrl} = req;
    let isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    console.log("NEXT URL: ", nextUrl.pathname)
    console.log("API AUTH ROUTE: ", isApiAuthRoute)
    console.log("PUBLIC ROUTE: ", isPublicRoute)
    console.log("AUTH ROUTE: ", isAuthRoute)
    console.log("IS LOGGED IN: ", isLoggedIn)
    if(isApiAuthRoute) {
      return;
    }

    if(isAuthRoute) {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return;
    }
    
    if(isPublicRoute) {
      return;
    }
    
    if (!isLoggedIn && !isPublicRoute) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    return;
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