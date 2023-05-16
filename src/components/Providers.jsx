"use client";

import { Toaster } from "react-hot-toast";

const Provider = ({ children }) => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </>
  );
};

export default Provider;
