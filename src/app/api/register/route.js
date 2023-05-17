import bcrypt from "bcrypt";
import { redis } from "@/lib/redis";
import { nanoid } from "nanoid";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    // Check if user already exists in Redis

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

    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    console.error("Failed to create user:", error);
    return new Response("Failed to create user", { status: 500 });
  }
}
