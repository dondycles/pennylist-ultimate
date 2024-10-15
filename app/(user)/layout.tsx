"use client";
import AnimatedNav from "@/components/nav";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useListState } from "@/store";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useEffect, useState } from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { password } = useListState();
  const [pin, setPin] = useState<string | null>(null);
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    if (pin === password) return setLocked(false);
  }, [password, pin]);

  useEffect(() => {
    if (password) setLocked(true);
  }, [password]);
  return (
    <main className="w-full h-full flex-1 flex flex-col justify-center overflow-hidden">
      <Dialog open={locked}>
        <DialogOverlay className="backdrop-blur-sm z-[100]" />
        <DialogContent className=" z-[101]">
          <DialogHeader>
            <DialogTitle hideCloseBtn>Enter PIN</DialogTitle>
          </DialogHeader>
          <InputOTP
            onChange={setPin}
            maxLength={4}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          >
            <InputOTPGroup className="pb-4 mx-auto">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </DialogContent>
      </Dialog>
      {children}
      <AnimatedNav />
    </main>
  );
}
