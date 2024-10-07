import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Footer from "@/components/footer";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();

  if (user) return redirect("/list");

  return (
    <div className="w-full pt-8 sm:pt-16 md:pt-32  h-full flex flex-col screen-x-padding gap-6">
      <div className="flex flex-col items-center justify-center w-full gap-4 text-center max-w-[800px] mx-auto">
        <Logo zoom={8} className="h-16" strokeWidth={24} />
        <h1 className="text-5xl font-black xs:text-6xl">
          Avoid becoming penniless, <br /> start using pennylist.
        </h1>
        <p className="text-xl text-muted-foreground">
          Designed to be simple like writing on a piece of paper. No more
          overwhelming features and complex interfaces.
        </p>
        <Button asChild>
          <Link href={"/sign-in"}>Get started</Link>
        </Button>
      </div>
      <div className="space-y-4 max-w-[512px] w-full mx-auto h-fit">
        <div className="w-full rounded-[--radius] border p-4">
          <p className="pr-4 text-2xl font-black w-fit">Simple</p>
          <p className="text-muted-foreground">
            As straightforward as jotting down notes on a piece of paper.
          </p>
        </div>
        <div className="w-full rounded-[--radius] border border-yellow-500 bg-yellow-500/5 text-yellow-500 p-4">
          <p className="pr-4 text-2xl font-black w-fit">Customizable</p>
          <p>Bored with black and white? Then, make it colorful.</p>
        </div>
        <div className="w-full rounded-[--radius] border p-4">
          <p className="pr-4 text-2xl font-black w-fit">Analytics</p>
          <p className="text-muted-foreground">
            Dive into your progress with insightful charts and tables.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
