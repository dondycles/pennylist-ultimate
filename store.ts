import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import _ from "lodash";

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    // console.log(name, "has been retrieved");
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    // console.log(name, "with value", value, "has been saved");
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    // console.log(name, "has been deleted");
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
  spendable: boolean;
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
  money_name: string;
};

export interface MoneyTransfer extends Money {
  transferAmount: number | undefined | null;
  reason: string;
  fee: number;
}

export type TransferState = {
  transferrings: {
    root: MoneyTransfer;
    branches: MoneyTransfer[];
  } | null;
  setBranchState: (
    value: number,
    id: string,
    reason: string,
    fee: number
  ) => void;
  setRootState: (id: string, reason: string) => void;
  setTransferrings: (
    state: { root: MoneyTransfer; branches: MoneyTransfer[] } | null
  ) => void;
};

export const useTransferState = create<TransferState>()(
  persist(
    (set) => ({
      transferrings: null,
      setBranchState: (value, id, reason, fee) =>
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
      setRootState: (id, reason) =>
        set(({ transferrings }) => {
          if (!transferrings) return {};
          const root = transferrings?.root;
          if (!root) return {};
          if (root.id !== id) return {};

          return {
            transferrings: {
              root: { ...transferrings?.root, reason },
              branches: transferrings.branches,
            },
          };
        }),
      reset: () =>
        set(() => {
          return { transferrings: null };
        }),
      setTransferrings: (state) =>
        set(() => {
          return {
            transferrings: state,
          };
        }),
    }),
    {
      name: "transfer-state",
      storage: createJSONStorage(() => storage),
    }
  )
);

export type ListState = {
  minimizeTotalMoney: boolean;
  view: "list" | "grid";
  hidden: boolean;
  compactMoney: boolean;
  setState: ({
    view,
    hidden,
    minimizeTotalMoney,
    compactMoney,
  }: {
    view: "list" | "grid";
    hidden: boolean;
    minimizeTotalMoney: boolean;
    compactMoney: boolean;
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
      compactMoney: false,
      setState: (state) => set(() => ({ ...state })),
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
  page: "charts" | "history";
  setPage: (page: "charts" | "history") => void;
};
export const useChartsState = create<ChartsState>()(
  persist(
    (set) => ({
      progressDays: "7",
      type: "daily",
      setState: (state) => set(() => ({ ...state })),
      page: "charts",
      setPage: (page) => set(() => ({ page: page })),
    }),
    {
      name: "charts-state",
      storage: createJSONStorage(() => storage),
    }
  )
);

export type MoneysStore = {
  moneys: Money[];
  addMoney: (money: Money) => void;
  delMoney: (id: string) => void;
  editMoney: (money: Money) => void;
  addNote: (id: string, note: MoneyNote) => void;
  delNote: (id: string, noteId: string) => void;
  setMoneyColor: (id: string, color: string) => void;
  sortBy: "created_at" | "amount" | "name";
  asc: boolean;
  sortMoneys: (sortBy: "created_at" | "amount" | "name", asc: boolean) => void;
  totalMoneys: (moneys: Money[]) => number;
  spendableTotalMoneys: (moneys: Money[]) => number;
  import: (moneys: Money[]) => void;
  delete: () => void;
  setSpendable: (money: Money) => void;
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
      totalMoneys: (moneys) => {
        return _.sum(moneys.map((m) => m.amount));
      },
      spendableTotalMoneys: (moneys) => {
        return _.sum(moneys.filter((m) => m.spendable).map((m) => m.amount));
      },
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
      sortBy: "amount",
      asc: false,
      sortMoneys: (sortBy, asc) =>
        set(() => {
          return { sortBy, asc };
        }),
      import: (moneys) =>
        set(() => {
          return { moneys };
        }),
      delete: () =>
        set(() => {
          return { moneys: [] };
        }),
      setSpendable: (money) =>
        set(({ moneys }) => {
          const newMoneys: Money[] = moneys.filter((m) => m.id !== money.id);
          const newMoney: Money = { ...money, spendable: !money.spendable };
          return { moneys: [...newMoneys, newMoney] };
        }),
    }),
    {
      name: "moneys",
      storage: createJSONStorage(() => storage),
    }
  )
);

export type LogsStore = {
  logs: Log[];
  addLog: (log: Log) => void;
  import: (log: Log[]) => void;
  delete: () => void;
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
      import: (logs) =>
        set(() => {
          return { logs };
        }),
      delete: () =>
        set(() => {
          return { logs: [] };
        }),
    }),
    { name: "logs" }
  )
);

export type LockerState = {
  locked: boolean;
  setLock: (state: boolean) => void;
  password: null | string;
  setPassword: (password: string | null) => void;
};

export const useLockerState = create<LockerState>()(
  persist(
    (set) => ({
      password: null,
      setPassword: (password) =>
        set(() => {
          return { password };
        }),
      locked: false,
      setLock: (locked) =>
        set(() => {
          return { locked };
        }),
    }),
    { name: "locker" }
  )
);
