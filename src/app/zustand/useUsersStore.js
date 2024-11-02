import { create } from "zustand";

export const useUsersStore = create((set) => ({
  users: [],
  updateUsers: (newUsers) => set({ users: newUsers }),
}));