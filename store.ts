import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";

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

export type Money = {
  id: string;
  name: string;
  amount: number;
  color: string;
  created_at: string;
  last_updated_at: string;
  notes: MoneyNote[];
};

export type MoneyNote = {
  id: string;
  note: string;
  created_at: string;
};

export type Log = {
  id: string;
  money_id: string;
  action: string;
  reason: string;
  created_at: string;
  changes: {
    prev: Money & { total: number };
    latest: Money & { total: number };
  };
  current_total: number;
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
    id: string,
    reason: string,
    fee: number
  ) => void;
  setRootState: (id: string, reason: string, fee: number) => void;
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

export interface MoneyTransfer extends Money {
  transferAmount: number | undefined | null;
  reason: string;
  fee: number;
}

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

type MoneysStore = {
  moneys: Money[];
  addMoney: (money: Money) => void;
  delMoney: (id: string) => void;
  editMoney: (money: Money) => void;
  addNote: (id: string, note: MoneyNote) => void;
  delNote: (id: string, noteId: string) => void;
  setMoneyColor: (id: string, color: string) => void;
};
export const useMoneysStore = create<MoneysStore>()(
  persist(
    (set) => ({
      moneys: [],
      addMoney: (money) =>
        set(({ moneys }) => {
          const newMoneys: Money[] = [...moneys, money];

          return { moneys: newMoneys };
        }),
      delMoney: (id) =>
        set(({ moneys }) => {
          const newMoneys: Money[] = moneys.filter((m) => m.id !== id);
          return { moneys: newMoneys };
        }),
      editMoney: (money) =>
        set(({ moneys }) => {
          const newMoneys: Money[] = moneys.filter((m) => m.id !== money.id);
          return { moneys: [...newMoneys, money] };
        }),
      addNote: (id, note) =>
        set(({ moneys }) => {
          const targetedMoney = moneys.find((m) => m.id === id);
          if (!targetedMoney) return { moneys };
          const newNotes: MoneyNote[] = [...targetedMoney.notes, note];
          const newMoney: Money = { ...targetedMoney, notes: newNotes };
          const moneysWOTargetMoney: Money[] = moneys.filter(
            (m) => m.id !== id
          );
          const newMoneys: Money[] = [...moneysWOTargetMoney, newMoney];
          return { moneys: newMoneys };
        }),
      delNote: (id, noteId) =>
        set(({ moneys }) => {
          const targetedMoney = moneys.find((m) => m.id === id);
          if (!targetedMoney) return { moneys };
          const newNotes: MoneyNote[] = targetedMoney.notes.filter(
            (n) => n.id !== noteId
          );
          const newMoney: Money = { ...targetedMoney, notes: newNotes };
          const moneysWOTargetMoney: Money[] = moneys.filter(
            (m) => m.id !== id
          );
          const newMoneys: Money[] = [...moneysWOTargetMoney, newMoney];
          return { moneys: newMoneys };
        }),
      setMoneyColor: (id, color) =>
        set(({ moneys }) => {
          const targetedMoney = moneys.find((m) => m.id === id);
          if (!targetedMoney) return { moneys };
          const newMoney: Money = { ...targetedMoney, color };
          const moneysWOTargetMoney: Money[] = moneys.filter(
            (m) => m.id !== id
          );
          const newMoneys: Money[] = [...moneysWOTargetMoney, newMoney];
          return { moneys: newMoneys };
        }),
    }),
    {
      name: "moneys",
      storage: createJSONStorage(() => storage),
    }
  )
);

type LogsStore = {
  logs: Log[];
  addLog: (log: Log) => void;
};
export const useLogsStore = create<LogsStore>()(
  persist(
    (set) => ({
      logs: [],
      addLog: (log) =>
        set(({ logs }) => {
          const newLogs = [...logs, log];
          return { logs: newLogs };
        }),
    }),
    { name: "logs" }
  )
);
