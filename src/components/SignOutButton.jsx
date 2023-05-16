"use client";

import { Loader2, LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Button from "./ui/Button";
import { signOut } from "next-auth/react";

const SignOutButton = ({ ...props }) => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  return (
    <Button
      {...props}
      variant="ghost"
      onClick={async () => {
        setIsSigningOut(true);
        try {
          await signOut();
        } catch (e) {
          toast.error("Failed to sign out");
          console.error(e);
        } finally {
          setIsSigningOut(false);
        }
      }}
    >
      {isSigningOut ? (
        <Loader2 className="animate-spin h-4 w-4" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
    </Button>
  );
};

export default SignOutButton;
