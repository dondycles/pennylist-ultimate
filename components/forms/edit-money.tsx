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
import { Money, useLogsStore, useMoneysStore } from "@/store";
import { useEffect } from "react";

const formSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.coerce.number(),
  reason: z.string().max(24).optional(),
  plusMinus: z.coerce.number(),
});
export default function EditMoneyForm({
  done,
  money,
}: {
  done: () => void;
  money: Money;
}) {
  const { editMoney, moneys, totalMoneys } = useMoneysStore();
  const { addLog } = useLogsStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...money,
      reason: undefined,
      plusMinus: undefined,
    },
  });

  async function onSubmit(latest: z.infer<typeof formSchema>) {
    if (money.amount === latest.amount && money.name === latest.name)
      return done();

    const amountDiff = latest.amount - money.amount;

    editMoney({
      ...money,
      amount: latest.amount,
      name: latest.name,
      last_updated_at: new Date().toISOString(),
    });
    addLog({
      changes: {
        prev: { ...money, total: totalMoneys(moneys) },
        latest: {
          ...money,
          amount: latest.amount,
          name: latest.name,
          last_updated_at: new Date().toISOString(),
          total: totalMoneys(moneys) + amountDiff,
        },
      },
      action: "edit",
      reason: latest.reason ?? "",
      created_at: new Date().toISOString(),
      current_total: totalMoneys(moneys) + amountDiff,
      id: crypto.randomUUID(),
      money_id: latest.id,
      money_name: latest.name,
    });
    done();
  }

  useEffect(() => {
    const plusMinus = form.watch("plusMinus");
    if (plusMinus) {
      form.setValue("amount", Number(money.amount) + Number(plusMinus));
    } else {
      form.setValue("amount", money.amount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("plusMinus")]);

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
                <Input placeholder="GCash" {...field} />
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
                <Input
                  disabled={form.watch("plusMinus")}
                  type="number"
                  placeholder="117"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-xs text-center text-muted-foreground">or</p>

        <FormField
          control={form.control}
          name="plusMinus"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
                Add or deduct (append a minus sign if deducting)
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
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
                <Input placeholder="I bought eggs" {...field} />
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
          Update
        </Button>
      </form>
    </Form>
  );
}
