import type { ChangeEvent } from "react";

export type Props = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "onChange"
> & {
  onChange?: (value: string) => void;
};

export default function Input(props: Props) {
  function onChange(event: ChangeEvent<HTMLInputElement>) {
    if (props.onChange) {
      props.onChange(event.currentTarget.value as string);
    }
  }

  return (
    <input
      {...props}
      className={[
        "text-md",
        "border-2",
        "border-neutral-600",
        "py-1",
        "px-2",
        "rounded-md",
        "outline-0",
        "bg-zinc-800",
        // transitions
        "transition-all",
        "duration-200",
        // focus
        "focus:bg-zinc-700",
      ].join(" ")}
      onChange={onChange}
    />
  );
}
