"use server";
import { cookies } from "next/headers";
export async function changeLocale(locale: string) {
  cookies().set("locale", locale);
}
export async function getLocale() {
  const language = cookies().get("locale")?.value || "en";
  return language;
}
