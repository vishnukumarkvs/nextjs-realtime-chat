"use client";

import { useForm } from "react-hook-form";
import Button from "./ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { credentialsValidator } from "@/lib/validations/credentials";
import { signIn } from "next-auth/react";

const CredentialsLogin = ({}) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(credentialsValidator),
  });

  const validateCredentials = async (email, password) => {
    console.log("tdata", email, password);
    try {
      const validatedCredentials = credentialsValidator.parse({
        email,
        password,
      });
      signIn("credentials", {
        email: validatedCredentials.email,
        password: validatedCredentials.password,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message });
        return;
      }
      setError("email", { message: "Something went wrong!" });
    }
  };
  const onSubmit = (data) => {
    console.log("my data", data);
    validateCredentials(data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="font-semibold mb-4">Credentials SignIn</p>
      <div className="relative flex flex-col">
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
            placeholder="name@example.com"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
            required
          />
        </div>
        <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      </div>
      <Button>Submit</Button>
    </form>
  );
};

export default CredentialsLogin;
