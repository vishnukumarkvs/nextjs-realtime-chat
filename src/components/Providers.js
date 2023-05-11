"use client";

import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

const Provider = ({ children }) => {
  return (
    <>
      <SessionProvider>
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </SessionProvider>
    </>
  );
};

export default Provider;
