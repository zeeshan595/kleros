import { useContext } from "react";
import { LoadingContext } from "../context/loading.context";

export default function Loading() {
  const { loading } = useContext(LoadingContext);
  if (!loading) return null;

  return (
    <div
      className={[
        "fixed",
        "left-0",
        "top-0",
        "w-full",
        "h-full",
        "z-100",
        "flex",
        "items-center",
        "justify-center",
      ].join(" ")}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div>Loading...</div>
    </div>
  );
}
