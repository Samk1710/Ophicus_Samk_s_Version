export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, audio, etc.)
     * - API routes
     * - Public pages (/, /login)
     */
    "/((?!_next/static|_next/image|favicon.ico|api|login|$).*)",
  ],
};
