import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface User {
  username: string;
  userId: string;
}

interface UserInfoI {
  user: User | null;
  isLoggedIn: boolean;
  logout: () => void;
  setUser: (user: User) => void;
}

export const userUserInfoStore = create<UserInfoI>()(
  persist(
    (set) => ({
      user: {
        userId: "1234",
        username: "ram",
      },
      isLoggedIn: false,
      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
        }),
      setUser: (user: User) =>
        set({
          user,
          isLoggedIn: true,
        }),
    }),
    {
      name: "userInfo",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
