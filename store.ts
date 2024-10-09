import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
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

type ListState = {
  view: "list" | "grid";
  hidden: boolean;
  sortBy: "created_at" | "amount" | "name";
  asc: boolean;
  setState: ({
    view,
    hidden,
    sortBy,
    asc,
  }: {
    view: "list" | "grid";
    hidden: boolean;
    sortBy: "created_at" | "amount" | "name";
    asc: boolean;
  }) => void;
};

export const useListState = create<ListState>()(
  persist(
    (set) => ({
      asc: false,
      hidden: false,
      sortBy: "created_at",
      view: "list",
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
