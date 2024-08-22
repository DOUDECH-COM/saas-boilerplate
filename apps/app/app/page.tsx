import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="p-6">
      Here's a shadcn/ui test for ya! <br />
      <Button>Click Me</Button> <br />
      <br />
      <br />
      <div>
        Note: this is a full boilerplate that contains different libraries and
        tools for both the frontend and backend. - for the frontend we're using
        NextJS with TypeScript and TailwindCSS - for the backend we're using
        Fastify with TypeScript with a great setup for autoloading routes,
        plugins and schemas!
        <br />
        <div className="text-3xl">Have fun!</div>
      </div>
    </main>
  );
}
