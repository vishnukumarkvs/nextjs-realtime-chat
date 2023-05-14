"use client";

import Button from "@/components/ui/Button";
import { useSession, signOut } from "next-auth/react";

const Dashboard = () => {
  const { data: session } = useSession();

  return (
    <div>
      <p>Hi Dashboard</p>
      <pre>{JSON.stringify(session)}</pre>
      <Button onClick={() => signOut()}>Sign Out</Button>
    </div>
  );
};

export default Dashboard;
