export type SelectOption<T> = {
  label: string;
  value: T;
};

export type Props<T> = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  options: SelectOption<T>[];
};

export default function Select<T>(props: Props<T>) {
  return (
    <select
      {...props}
      className={[
        "w-full",
        "border-2",
        "border-neutral-600",
        "p-2",
        "rounded-md",
        "outline-0",
        "bg-zinc-800",
        "text-md",
      ].join(" ")}
    >
      {props.options.map((option) => (
        <option key={String(option.value)} value={String(option.value)}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
