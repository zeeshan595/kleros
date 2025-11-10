import type { Props as SelectProps } from "./core/select";
import type { ChangeEvent } from "react";
import { MoveType } from "../hooks/game.hook";
import Select from "./core/select";

export type Props = Omit<SelectProps<number>, "options" | "onChange"> & {
  onChange?: (move: MoveType) => void;
};

export default function MoveSelector(props: Props) {
  const moveOptions = Object.values(MoveType)
    .map((move) => Number.parseInt(move as string))
    .filter((move) => !isNaN(move))
    .map((move) => ({
      value: move,
      label: MoveType[move]!,
    }));

  function onchangeEvent(event: ChangeEvent<HTMLSelectElement>) {
    if (props.onChange) {
      let val = Number.parseInt(event.currentTarget.value);
      if (isNaN(val)) {
        val = 0;
      }
      props.onChange(val as MoveType);
    }
  }

  return <Select {...props} options={moveOptions} onChange={onchangeEvent} />;
}
