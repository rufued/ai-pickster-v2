import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

function detectedLocale(request: NextRequest): Locale {
  const saved = request.cookies.get("locale")?.value;
  if (isLocale(saved)) return saved;
  const country = request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry");
  return country?.toUpperCase() === "KR" ? "ko" : defaultLocale;
}

export function middleware(request: NextRequest) {
  const locale = detectedLocale(request);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-app-locale", locale);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (!request.cookies.has("locale")) response.cookies.set("locale", locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  return response;
}

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.png).*)"] };
