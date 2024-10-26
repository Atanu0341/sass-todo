import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = createRouteMatcher(["/", "/api/webhook/register", "/sign-in", "/sign-up"]);

export default clerkMiddleware(async (auth, req) => {
  try {
    // Extract user ID from authentication details
    const { userId } = await auth();

    // If no user ID and route is not public, redirect to sign-in
    if (!userId && !publicRoutes(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (userId) {
      const client = await clerkClient();
      // Fetch user data from Clerk
      const user = await client.users.getUser(userId);
      const role = user.publicMetadata.role as string | undefined;

      // Admin role redirection logic
      if (role === "admin" && req.nextUrl.pathname === "/dashboard") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }

      // Prevent non-admin users from accessing admin routes
      if (role !== "admin" && req.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // Redirect authenticated users trying to access public routes
      if (publicRoutes(req)) {
        return NextResponse.redirect(
          new URL(role === "admin" ? "/admin/dashboard" : "/dashboard", req.url)
        );
      }
    }
  } catch (error) {
    console.error("Error handling authentication middleware:", error);
    return NextResponse.redirect(new URL("/error", req.url));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
