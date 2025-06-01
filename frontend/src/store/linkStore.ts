import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AccessI {
  type: "accessCode" | "sharable";
  expiration: Date;
  link?: string;
  code?: string;
}

interface LinkStoreI {
  accessTokens: AccessI[];
  addToken: (token: AccessI) => void;
}

export const useCodeStore = create<LinkStoreI>()(
  persist(
    (set) => ({
      accessTokens: [],
      addToken: (token: AccessI) =>
        set((state) => {
          const filteredTokens = state.accessTokens.filter(
            (token) => token.expiration < new Date(Date.now())
          );
          return { accessTokens: [...filteredTokens, token] };
        }),
    }),
    {
      name: "Codes",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
