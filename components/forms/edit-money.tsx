"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { edit_money } from "@/app/actions/moneys";
import { useUser } from "@clerk/nextjs";
import { selectMoney } from "@/drizzle/schema";

const formSchema = z.object({
  id: z.number().min(1),
  name: z.string().min(1).max(24),
  amount: z.coerce.number(),
  lister: z.string().min(1),
  reason: z.string().max(24).optional(),
});
export default function EditMoneyForm({
  done,
  money,
}: {
  done: () => void;
  money: selectMoney;
}) {
  const { user, isLoaded } = useUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...money, reason: undefined },
  });

  async function onSubmit(latest: z.infer<typeof formSchema>) {
    if (money.amount === latest.amount && money.name === latest.name)
      return done();
    if (!isLoaded) return;
    if (!user) return;
    await edit_money({ latest: latest, prev: money }, latest.reason ?? "N/A");
    done();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 flex-1"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  className="rounded-full"
                  placeholder="GCash"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input className="rounded-full" placeholder="117" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason (optional)</FormLabel>
              <FormControl>
                <Input
                  className="rounded-full"
                  placeholder="I bought eggs"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="mb-0 mt-auto rounded-full"
        >
          Update
        </Button>
      </form>
    </Form>
  );
}
