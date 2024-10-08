import { Skeleton } from "./ui/skeleton";

export default function Loader() {
  return (
    <div className="flex flex-col gap-1 max-w-[800px] mx-auto w-screen">
      <Skeleton className="w-full h-[136px]" />
      <Skeleton className="w-full h-24" />
      <Skeleton className="w-full h-24" />
      <Skeleton className="w-full h-24" />
    </div>
  );
}
