import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { ADMIN_COOKIE, validAdminToken } from "@/lib/admin-auth";

const COUNTRY_LOCALES: Partial<Record<string, Locale>> = {
  KR: "ko",
  CN: "zh", HK: "zh", MO: "zh", SG: "zh",
  JP: "ja",
  DE: "de", AT: "de", CH: "de", LI: "de",
  FR: "fr", MC: "fr",
  PT: "pt", BR: "pt", AO: "pt", MZ: "pt", CV: "pt", GW: "pt", ST: "pt", TL: "pt",
  ES: "es", MX: "es", AR: "es", BO: "es", CL: "es", CO: "es", CR: "es", CU: "es",
  DO: "es", EC: "es", SV: "es", GT: "es", HN: "es", NI: "es", PA: "es", PY: "es",
  PE: "es", PR: "es", UY: "es", VE: "es",
  VN: "vi",
  SA: "ar", AE: "ar", EG: "ar", DZ: "ar", BH: "ar", IQ: "ar", JO: "ar", KW: "ar",
  LB: "ar", LY: "ar", MA: "ar", OM: "ar", QA: "ar", SD: "ar", SY: "ar", TN: "ar", YE: "ar",
  RU: "ru", BY: "ru", KZ: "ru", KG: "ru", AM: "ru", AZ: "ru", MD: "ru", TJ: "ru", TM: "ru", UZ: "ru",
  TR: "tr",
  IT: "it", SM: "it", VA: "it",
  IN: "hi",
  ID: "id",
};

function detectedLocale(request: NextRequest): Locale {
  const saved = request.cookies.get("locale")?.value;
  if (isLocale(saved)) return saved;
  const country = request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry");
  return COUNTRY_LOCALES[country?.toUpperCase() ?? ""] ?? defaultLocale;
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/login") {
    if (!await validAdminToken(request.cookies.get(ADMIN_COOKIE)?.value)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  const locale = detectedLocale(request);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-app-locale", locale);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (!request.cookies.has("locale")) response.cookies.set("locale", locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  return response;
}

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.png).*)"] };
