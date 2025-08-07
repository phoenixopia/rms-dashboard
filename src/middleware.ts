import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const i18nMiddleware = createMiddleware(routing);

const protectedRoutes = ["dashboard", "admin", "profile", "change-password"];
const publicRoutes = ["login", "about", "contact"];

const locales = routing.locales;
const defaultLocale = routing.defaultLocale;

export default async function middleware(request: NextRequest) {
  const response = i18nMiddleware(request);

  if (response && response.headers.has("Location")) {
    return response;
  }

  const authCookie = request.cookies.get("auth");
  const isAuthenticated = !!authCookie;

  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  const basePathname = pathnameIsMissingLocale
    ? pathname
    : pathname.split("/").slice(2).join("/");

  const isProtectedRoute = protectedRoutes.some((route) =>
    basePathname.startsWith(route),
  );
  console.log("Isprotected rouet", isProtectedRoute);

  const isAuthRoute = publicRoutes.some((route) =>
    basePathname.startsWith(route),
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL(`/${defaultLocale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    const dashboardUrl = new URL(`/${defaultLocale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
