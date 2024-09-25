import { NextResponse } from "next/server";

export function middleware(request) {
  // Extract IP address from the request headers
  const ip =
    request.headers.get("x-forwarded-for") || request.ip || "Unknown IP";

  // Update request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-client-ip", ip); // Add the IP address to request headers

  // Create the response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("x-client-ip", ip); // Set IP address in the response headers

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
