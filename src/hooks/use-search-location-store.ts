import { create } from "zustand";

interface SearchLocationStore {
  location: string;
  setLocation: (location: string) => void;
  reset: () => void;
}

const useSearchLocationStore = create<SearchLocationStore>((set) => ({
  location: "",
  setLocation: (location) => set({ location }),
  reset: () => set({ location: "" }),
}));

export default useSearchLocationStore;
