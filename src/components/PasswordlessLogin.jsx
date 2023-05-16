"use client";

import { addFriendValidator } from "@/lib/validations/add-friend";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "./ui/Button";
import { toast } from "react-hot-toast";

const PasswordlessLogin = ({}) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addFriendValidator),
  });

  const loginWithEmail = async (email) => {
    console.log("tdata", email);
    try {
      const validatedCredentials = addFriendValidator.parse({
        email,
      });
      signIn("email", {
        email: validatedCredentials.email,
      });
      toast.success("Email sent! Check your inbox for signin link.");
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
    loginWithEmail(data.email);
  };
  return (
    <div className="flex flex-col gap-y-4 justify-center">
      <p className="font-semibold">Passwordless SignIn</p>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div class="relative flex flex-col ">
            <div className="mb-4">
              <input
                {...register("email")}
                type="email"
                name="email"
                id="email"
                class="w-full bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block p-2.5"
                placeholder="name@example.com"
                required
              />
            </div>
            <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
          </div>
          <Button className="w-full">Sign In with Email</Button>
        </form>
      </div>
      <div className="flex items-center justify-center">
        <p className="text-gray-700 text-sm"> -- OR CONTINUE WITH --</p>
      </div>
      <div className="flex items-center justify-center">
        <Button
          type="sumbit"
          onClick={() => signIn("google")}
          class="p-2 rounded-md bg-black text-white font-semibold text-center block w-full focus:outline-none focus:ring focus:ring-offset-2 focus:ring-indigo-500 focus:ring-opacity-80 cursor-pointer"
        >
          SignIn with Google
        </Button>
      </div>
    </div>
  );
};

export default PasswordlessLogin;
