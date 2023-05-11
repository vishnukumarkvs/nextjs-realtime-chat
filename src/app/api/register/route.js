import bcrypt from "bcrypt";
import { redis } from "@/lib/redis";
import { checkUserExists } from "@/lib/utils";
import { nanoid } from "nanoid";
import { signIn } from "next-auth/react";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    // Check if user already exists in Redis
    const userExists = await checkUserExists(email);
    if (userExists) {
      return new Response("User already exists", { status: 409 });
    }

    // Generate a salt and hash the password using bcrypt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const id = nanoid();

    const user = {
      id,
      email,
      password: hash,
      salt,
    };

    const result = await redis.set(`user:${email}`, JSON.stringify(user));
    if (result !== "OK") {
      throw new Error("Failed to create user");
    }

    signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashbaord",
    });

    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    console.error("Failed to create user:", error);
    return new Response("Failed to create user", { status: 500 });
  }
}
