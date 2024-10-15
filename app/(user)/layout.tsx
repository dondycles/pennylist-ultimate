"use client";
import Locker from "@/components/locker";
import AnimatedNav from "@/components/nav";
import { useState } from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lockerMounted, setLockerMounted] = useState(false);
  return (
    <main className="w-full h-full flex-1 flex flex-col justify-center overflow-hidden">
      <Locker mounted={lockerMounted} setMounted={setLockerMounted} />
      {!lockerMounted ? null : (
        <>
          {children} <AnimatedNav />
        </>
      )}
    </main>
  );
}
