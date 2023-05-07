import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="bg-gray-400 flex min-h-screen flex-col items-center justify-between p-24">
      <Button variant="ghost" size="lg">
        Hello
      </Button>
      <Button size="sm">Vivek</Button>
    </main>
  );
}
