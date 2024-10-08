export default function Scrollable({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col overflow-auto max-w-[800px] w-screen mx-auto gap-4 pb-32">
      {children}
    </div>
  );
}
