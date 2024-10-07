import { ScrollArea } from "./ui/scroll-area";
export default function Scrollable({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full h-[100dvh]">
      <ScrollArea className="w-full h-full">
        <div className="w-full xs:max-w-[800px] mx-auto px-2 flex flex-col justify-start gap-2 mb-[5.5rem]">
          {children}
        </div>
      </ScrollArea>
    </main>
  );
}
