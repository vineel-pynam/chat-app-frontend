import { create } from "zustand";

export const useChatReceiverStore = create((set) => ({
  chatReceiver: '',
  updateChatReceiver: (newChatReceiver) => set({ chatReceiver: newChatReceiver }),
}));