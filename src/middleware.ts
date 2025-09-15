import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


const intlMiddleware = createMiddleware(routing);

export function middleware(req: NextRequest) {
  const response = intlMiddleware(req);

  const pathParts = req.nextUrl.pathname.split('/');

  const locale = pathParts[1] || 'en'; 
  
  
  const accessToken = req.cookies.get("token");
  const token = accessToken?.value; 
  const protectedRoutes = ["/dashboard"];
  

  const pathWithoutLocale = pathParts.slice(2).join('/') || '/';

  const fullPathWithoutLocale = `/${pathWithoutLocale}`;

  
  const isProtectedRoute = protectedRoutes.some((path) =>
    fullPathWithoutLocale.startsWith(path)
  );
 
  if (isProtectedRoute) {
    if (!accessToken) {
 
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }
    
    if (token) {
      const tokenParts = token.split('.'); 
      if (tokenParts.length === 3) {
        try {
          const tokenPayload = JSON.parse(atob(tokenParts[1])); 
       
          const isExpired = tokenPayload.exp * 1000 < Date.now();
      
 
     if (isExpired) {
   
    const redirectResponse = NextResponse.redirect(new URL(`/${locale}`, req.url));
    
  
    const cookieClearOptions = {
        expires: new Date(0),
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict" as const
       
    };

    redirectResponse.cookies.set("token", "", cookieClearOptions);
    redirectResponse.cookies.set("auth", "", cookieClearOptions);

  
    return redirectResponse;
}
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    '/([\\w-]+)?/reset-password/(.+)',
  ],
};