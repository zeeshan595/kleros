import { useContext } from "react";
import { ErrorContext } from "../context/error.context";
import Button from "./core/button";

export default function Broken() {
  const { error, setError } = useContext(ErrorContext);

  if (!error) return null;

  function onCloseClick() {
    setError(null);
  }

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
        "flex-col",
        "items-center",
        "justify-center",
      ].join(" ")}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <h1 className="text-4xl">There was an issue</h1>
      <p className="text-md">{error}</p>
      <Button onClick={onCloseClick}>Close</Button>
    </div>
  );
}
