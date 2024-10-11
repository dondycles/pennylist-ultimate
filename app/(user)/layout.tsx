import Scrollable from "@/components/scrollable";

import AnimatedNav from "@/components/nav";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full h-full flex-1 flex flex-col justify- overflow-hidden">
      <Scrollable>{children}</Scrollable>
      <AnimatedNav />
    </main>
  );
}
