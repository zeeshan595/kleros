import { createContext, useState, type PropsWithChildren } from "react";

export const ErrorContext = createContext<{
  error: string | null;
  setError: (value: string | null) => void;
}>({
  error: null,
  setError: () => {},
});

export function ErrorContextProvider({ children }: PropsWithChildren) {
  const [error, setError] = useState<string | null>(null);

  return (
    <ErrorContext.Provider
      value={{
        error,
        setError,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
}
