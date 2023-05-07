"use client";

import Button from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";

const Login = () => {
  console.log("Login Page");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login(provider) {
    setIsLoading(true);
    try {
      await signIn(provider, { email, password });
    } catch (error) {
      toast.error("Something went wrong with your login.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full flex flex-col items-center max-w-md space-y-8">
        <div className="flex flex-col items-center gap-8">
          {/* Your logo goes here */}
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            login("credentials");
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <Button
            isLoading={isLoading}
            type="submit"
            className="max-w-sm mx-auto w-full"
          >
            Log in
          </Button>
        </form>

        <Button
          isLoading={isLoading}
          type="button"
          className="max-w-sm mx-auto w-full"
          onClick={() => login("google")}
        >
          {isLoading ? null : "Log in with Google"}
        </Button>
      </div>
    </div>
  );
};

export default Login;
