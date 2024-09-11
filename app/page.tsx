import { Button } from "@/components/ui/button";

export default function Home() {
  return (
   <div className="flex items-center justify-center w-screen h-screen">
    <Button variant="outline" className="" asChild>
      <a href="/login">Login</a>
    </Button>
   </div>
  );
}
