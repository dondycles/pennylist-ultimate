"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useLockerState } from "@/store";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useEffect, useState } from "react";

export default function Locker({
  setMounted,
  mounted,
}: {
  setMounted: (state: boolean) => void;
  mounted: boolean;
}) {
  const { password, locked, setLock } = useLockerState();
  const [pin, setPin] = useState<string | null>(null);

  useEffect(() => {
    if (!mounted) return;
    if (pin === password) return setLock(false);
  }, [password, pin, setLock, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (password) setLock(true);
  }, [password, setLock, mounted]);

  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  return (
    <Dialog open={locked}>
      <DialogOverlay className="backdrop-blur-sm bg-black/50  z-[100]" />
      <DialogContent className=" z-[101]">
        <DialogHeader>
          <DialogTitle hideCloseBtn>Enter PIN </DialogTitle>
          <DialogDescription>Prove you are the lister.</DialogDescription>
        </DialogHeader>
        <InputOTP
          onChange={setPin}
          maxLength={4}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        >
          <InputOTPGroup className="pb-4 mx-auto">
            <InputOTPSlot autoFocus={true} index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </DialogContent>
    </Dialog>
  );
}
