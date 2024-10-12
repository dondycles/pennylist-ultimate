import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import { MoneyWithLogs } from "./drizzle/infered-types";

export interface MoneyTransfer extends Omit<MoneyWithLogs, "money_log"> {
  transferAmount: number | undefined | null;
  reason: string;
  fee: number;
}
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log(name, "has been retrieved");
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log(name, "with value", value, "has been saved");
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, "has been deleted");
    await del(name);
  },
};

export type ListState = {
  minimizeTotalMoney: boolean;
  isTransferring: boolean;
  view: "list" | "grid";
  hidden: boolean;
  sortBy: "created_at" | "amount" | "name";
  asc: boolean;
  compactMoney: boolean;
  transferrings: {
    root: MoneyTransfer;
    branches: MoneyTransfer[];
  } | null;
  setTransfereesState: (
    value: number,
    id: number,
    reason: string,
    fee: number
  ) => void;
  setRootState: (id: number, reason: string, fee: number) => void;
  setState: ({
    view,
    hidden,
    sortBy,
    asc,
    minimizeTotalMoney,
    isTransferring,
    transferrings,
    compactMoney,
  }: {
    view: "list" | "grid";
    hidden: boolean;
    sortBy: "created_at" | "amount" | "name";
    asc: boolean;
    minimizeTotalMoney: boolean;
    isTransferring: boolean;
    compactMoney: boolean;
    transferrings: {
      root: MoneyTransfer;
      branches: MoneyTransfer[];
    } | null;
  }) => void;
};

export const useListState = create<ListState>()(
  persist(
    (set) => ({
      asc: false,
      hidden: false,
      sortBy: "created_at",
      view: "list",
      minimizeTotalMoney: false,
      isTransferring: false,
      transferrings: null,
      compactMoney: false,
      setState: (state) => set(() => ({ ...state })),
      setTransfereesState: (value, id, reason, fee) =>
        set(({ transferrings }) => {
          if (!transferrings) return {};
          const branch = transferrings?.branches.find((b) => b.id === id);
          if (!branch) return {};
          const newBranchesData = transferrings?.branches.filter(
            (b) => b.id !== id
          );
          return {
            transferrings: {
              branches: [
                ...newBranchesData,
                { ...branch, transferAmount: value, reason, fee },
              ],
              root: transferrings?.root,
            },
          };
        }),
      setRootState: (id, reason, fee) =>
        set(({ transferrings }) => {
          if (!transferrings) return {};
          const root = transferrings?.root;
          if (!root) return {};
          if (root.id !== id) return {};

          return {
            transferrings: {
              root: { ...transferrings?.root, fee, reason },
              branches: transferrings.branches,
            },
          };
        }),
    }),
    {
      name: "list-state",
      storage: createJSONStorage(() => storage),
    }
  )
);

export type UseListState = typeof useListState;

type ChartsState = {
  progressDays: "7" | "14" | "28" | "365";
  type: "monthly" | "daily";
  setState: ({
    progressDays,
    type,
  }: {
    progressDays: "7" | "14" | "28" | "365";
    type: "monthly" | "daily";
  }) => void;
};

export const useChartsState = create<ChartsState>()(
  persist(
    (set) => ({
      progressDays: "7",
      type: "daily",
      setState: (state) => set(() => ({ ...state })),
    }),
    {
      name: "charts-state",
      storage: createJSONStorage(() => storage),
    }
  )
);
