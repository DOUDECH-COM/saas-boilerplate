"use server";
import { cookies } from "next/headers";
export async function changeLocale(locale: string) {
  cookies().set("locale", locale);
}
export async function getLocale() {
  return cookies().get("locale")?.value || "en";
}
