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
    // Protect /dashboard and its sub-routes
    "/dashboard(.*)",

    // Skip static files, Next.js internals, and public routes
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
