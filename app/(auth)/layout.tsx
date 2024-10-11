import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background flex flex-col h-full w-full items-center justify-start gap-16">
      <div className="flex justify-between gap-4 w-full max-w-[800px] px-5 pt-5">
        <Button asChild>
          <Link href={"/"}>Home</Link>
        </Button>
        <Button variant={"secondary"} asChild>
          <Link href={"/sign-up"}>Sign Up</Link>
        </Button>
      </div>
      {children}
    </div>
  );
}
