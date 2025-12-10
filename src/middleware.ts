import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected routes (e.g., /dashboard and its sub-routes)
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Protect /dashboard and its sub-routes
  if (isProtectedRoute(req)) {
    await auth.protect(); // Redirects to sign-in if not authenticated
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon\\.ico$|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)",
  ],
};
