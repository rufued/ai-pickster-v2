import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "scorehub_admin";

async function sessionToken(password: string) {
  const bytes = new TextEncoder().encode(`scorehub-admin:${password}`);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function validAdminToken(token?: string | null) {
  const password = process.env.ADMIN_PASSWORD;
  return Boolean(password && token && token === await sessionToken(password));
}

export async function isAdminRequest(request: NextRequest | Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const token = cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${ADMIN_COOKIE}=`))?.slice(ADMIN_COOKIE.length + 1);
  return validAdminToken(token);
}

export async function tokenForAdminPassword(candidate: string) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || candidate !== password) return null;
  return sessionToken(password);
}
