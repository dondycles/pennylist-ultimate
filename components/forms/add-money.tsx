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
import { useLogsStore, useMoneysStore } from "@/store";
const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(24),
  amount: z.coerce.number(),
  created_at: z.string(),
  last_updated_at: z.string(),
  color: z.string(),
  notes: z.array(
    z.object({
      id: z.string(),
      note: z.string(),
      created_at: z.string(),
    })
  ),
});

export default function AddMoneyForm({ done }: { done: () => void }) {
  const { addMoney, moneys, totalMoneys, sortMoneys, sortBy, asc } =
    useMoneysStore();
  const { addLog } = useLogsStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      amount: undefined,
      color: "",
      created_at: "",
      last_updated_at: "",
      notes: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const id = crypto.randomUUID();
    addMoney({
      ...values,
      id,
      created_at: new Date().toISOString(),
      last_updated_at: new Date().toISOString(),
    });
    addLog({
      action: "add",
      changes: {
        latest: { ...values, total: totalMoneys(moneys) + values.amount },
        prev: { ...values, total: totalMoneys(moneys), name: "", amount: 0 },
      },
      created_at: new Date().toISOString(),
      current_total: totalMoneys(moneys) + values.amount,
      id: crypto.randomUUID(),
      money_id: id,
      reason: "add",
      money_name: values.name,
    });
    sortMoneys(sortBy, asc);

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
