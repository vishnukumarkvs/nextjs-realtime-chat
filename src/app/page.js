import Button from "@/components/ui/Button";
import { redis } from "@/lib/redis";

export default async function Home() {
  await redis.set("hello", "buddy");
  return (
    <main className="bg-gray-400 flex min-h-screen flex-col items-center justify-between p-24">
      <Button variant="ghost" size="lg">
        Hello
      </Button>
    </main>
  );
}
