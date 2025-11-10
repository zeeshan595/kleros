import { createContext, useState, type PropsWithChildren } from "react";

export const LoadingContext = createContext<{
  loading: boolean;
  setLoading: (val: boolean) => void;
}>({
  loading: false,
  setLoading: () => {},
});

export function LoadingContextProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}
