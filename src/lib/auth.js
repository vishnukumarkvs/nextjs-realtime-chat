import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { redis } from "./redis";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const getGoogleCredentials = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Google credentials");
  }

  return { clientId, clientSecret };
};

const authorizeCredentials = async (credentials) => {
  const userString = await redis.get(`user:${credentials.email}`);

  if (!userString) {
    throw new Error("No user found");
  }

  const user =
    typeof userString === "object" ? userString : JSON.parse(userString);
  const { password, salt } = user;
  const hash = await bcrypt.hash(credentials.password, salt);

  if (hash !== password) {
    throw new Error("Incorrect password");
  }

  return user;
};

const jwtCallback = async ({ token, user }) => {
  if (!user) {
    return token;
  }

  let dbUser = await redis.get(`user:${token.id}`);

  if (typeof dbUser === "string") {
    try {
      dbUser = JSON.parse(dbUser);
    } catch (err) {
      console.error("Error parsing user object:", err);
    }
  }

  if (!dbUser) {
    token.id = user.id;
    return token;
  }

  return {
    id: dbUser?.id,
    name: dbUser?.name,
    email: dbUser?.email,
    image: dbUser?.image,
  };
};

const sessionCallback = ({ session, token }) => {
  if (token) {
    session.user.id = token.id;
    session.user.name = token.name;
    session.user.email = token.email;
    session.user.image = token.image;
  }

  return session;
};

export const authOptions = {
  adapter: UpstashRedisAdapter(redis),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider(getGoogleCredentials()),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { type: "text", placeholder: "test@gmail.com" },
        password: { type: "password", placeholder: "pa$$w0rd" },
      },
      authorize: authorizeCredentials,
    }),
  ],
  callbacks: {
    jwt: jwtCallback,
    session: sessionCallback,
    redirect: () => "/dashboard",
  },
};
