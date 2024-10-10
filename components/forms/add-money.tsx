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
import { add_money } from "@/app/actions/moneys";
import { useContext } from "react";
import { ListDataContext } from "../providers/list";
const formSchema = z.object({
  name: z.string().min(1).max(24),
  amount: z.coerce.number(),
  lister: z.string().min(1),
});

export default function AddMoneyForm({ done }: { done: () => void }) {
  const { currentTotal, user } = useContext(ListDataContext);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: undefined,
      lister: user?.id,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    await add_money(values, currentTotal);
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
                <Input autoFocus placeholder="GCash" {...field} />
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
                <Input min={0} type="number" placeholder="117" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="mb-0 mt-auto"
        >
          Add
        </Button>
      </form>
    </Form>
  );
}
