import Button from "@/components/ui/Button";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button variant="ghost" size="lg">
        Hello
      </Button>
    </main>
  );
}
