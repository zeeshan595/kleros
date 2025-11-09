export type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function Button(props: Props) {
  return (
    <button
      {...props}
      className={[
        "cursor-pointer",
        "px-4 py-2",
        "bg-neutral-800",
        "rounded-full",
        // transitions
        "transition-all",
        "duration-200",
        // hover
        "hover:shadow-md",
        "hover:shadow-neutral-700",
      ].join(" ")}
    >
      {props.children}
    </button>
  );
}
