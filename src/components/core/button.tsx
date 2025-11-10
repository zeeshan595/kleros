export type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function Button(props: Props) {
  return (
    <div>
      <button
        {...props}
        className={[
          "cursor-pointer",
          "px-4 py-2",
          "bg-zinc-800",
          "rounded-full",
          // transitions
          "transition-all",
          "duration-200",
          // hover
          "hover:shadow-md",
          "hover:bg-zinc-700",
        ].join(" ")}
      >
        {props.children}
      </button>
    </div>
  );
}
