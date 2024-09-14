import { Button } from "@/components/ui/button";

export default function Home() {
  return (
   <div className="flex items-center justify-center w-screen h-screen">
      <div className="flex flex-col gap-y-4">
      <Button variant="outline" className="" asChild>
        <a href="/login">Login</a>
      </Button>
      <Button variant="outline" className="" asChild>
        <a href="/map">FBI Crime Data Graphing Tool</a>
      </Button>
      </div>
   </div>
  );
}
