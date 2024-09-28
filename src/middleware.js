import { NextResponse } from "next/server";
import { RESTRICTED_COUNTRIES } from "./data/restrictedCountries";
import { getIpUrl } from "./lib/helpers";
const ACCESS_TOKEN = process.env.IPINFO_TOKEN;

export async function middleware(request) {
  // Extract IP address from the request headers
  let ip = request.headers.get("x-forwarded-for") || request.ip || "Unknown IP";

  if (ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }

  // Fetch geolocation info usingipinfo.io
  const geoRes = await fetch(getIpUrl(ip, ACCESS_TOKEN));
  const geoData = await geoRes.json();

  const isRestricted = RESTRICTED_COUNTRIES.includes(geoData.country);

  // If the country is restricted, redirect to /restricted, but don't apply middleware to /restricted
  if (isRestricted && !request.nextUrl.pathname.startsWith("/restricted")) {
    return NextResponse.redirect(new URL("/restricted", request.url));
  }

  // Update request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-client-ip", geoData.country);

  // Create the response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("x-client-ip", geoData.country); // Set IP address in the response headers

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
    "/", // Explicitly match the root "/"
  ],
};
