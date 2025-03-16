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
import { Log, Money, useLogsStore, useMoneysStore } from "@/store";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Minus, Plus, RotateCw } from "lucide-react";
import { Badge } from "../ui/badge";
import CommonReasons from "../common-reasons";
const formSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.coerce.number(),
  reason: z.string().optional(),
  plusMinus: z.coerce.number().optional(),
});
export default function EditMoneyForm({
  done,
  money,
}: {
  done: () => void;
  money: Money;
}) {
  const { editMoney, moneys, totalMoneys } = useMoneysStore();
  const { addLog, logs } = useLogsStore();

  const [operation, setOperation] = useState<1 | -1>(1);
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
      form.setValue(
        "amount",
        Number(money.amount) + Number(plusMinus) * operation
      );
    } else {
      form.setValue("amount", money.amount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("plusMinus"), operation]);

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
        <div className="flex flex-row gap-1 items-end">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Amount</FormLabel>
                <div className="flex-1 flex flex-row gap-2">
                  <FormControl>
                    <Input
                      className="flex-1"
                      disabled={!!form.watch("plusMinus")}
                      type="number"
                      placeholder="117"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {Number(field.value) === money.amount ? null : (
                    <Button
                      type="button"
                      onClick={() => form.setValue("amount", money.amount)}
                      size={"icon"}
                      variant={"secondary"}
                    >
                      <RotateCw size={16} />
                    </Button>
                  )}
                </div>
              </FormItem>
            )}
          />
        </div>

        {Number(form.watch("amount")) !== money.amount &&
        !form.watch("plusMinus") ? (
          <p className="text-xs text-muted-foreground">
            {form.watch("amount") - money.amount > 0 ? "Added: " : "Deducted: "}
            {form.watch("amount") - money.amount}
          </p>
        ) : (
          <div className="flex flex-row-reverse items-end justify-center gap-2">
            <ToggleGroup
              value={String(operation)}
              onValueChange={(v) => setOperation(v === "1" ? 1 : -1)}
              type="single"
              className="gap-2"
            >
              <ToggleGroupItem
                type="button"
                className="rounded-full"
                value="1"
                aria-label="Toggle Plus"
              >
                <Plus className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                type="button"
                className="rounded-full"
                value="-1"
                aria-label="Toggle Minus"
              >
                <Minus className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            <FormField
              control={form.control}
              name="plusMinus"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>or Add/Deduct</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

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
        <CommonReasons
          logs={logs}
          setValue={(v) => form.setValue("reason", v)}
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
