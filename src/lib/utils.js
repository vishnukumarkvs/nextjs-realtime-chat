import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { redis } from "./redis";

export function cn(...input) {
  return twMerge(clsx(...input));
}

export async function checkUserExists(email) {
  const userString = await redis.get(`user:${email}`);
  return userString !== null;
}
