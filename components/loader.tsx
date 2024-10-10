import { Skeleton } from "./ui/skeleton";

export default function Loader() {
  return (
    <div className="flex flex-col max-w-[800px] mx-auto w-screen">
      {/* <Skeleton className="w-full h-28 rounded-b-3xl shadow-lg" /> */}
      <div className="flex flex-col gap-1">
        {Array.from({ length: 3 }, (_, i) => {
          return (
            <Skeleton
              key={`skeleton-${i}`}
              className="w-full h-36 border-b last:border-b-0 bg-transparent rounded-none flex flex-col p-4 gap-4"
            >
              <Skeleton className="w-36 h-6" />
              <Skeleton className="w-36 h-6" />
              <div className="w-24  mb-0 mt-auto flex flex-row gap-6">
                <Skeleton className="size-6 aspect-square" />
                <Skeleton className="size-6 aspect-square" />
                <Skeleton className="size-6 aspect-square" />
                <Skeleton className="size-6 aspect-square" />
              </div>
            </Skeleton>
          );
        })}
      </div>
    </div>
  );
}
