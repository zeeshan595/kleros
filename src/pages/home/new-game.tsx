import { useState } from "react";
import { MoveType } from "../../hooks/game.hook";
import Input from "../../components/core/input";
import Select from "../../components/core/select";
import Button from "../../components/core/button";

export type Props = {
  onNewGameClick?: (
    opponentAddress: string,
    move: MoveType,
    stake: string
  ) => void;
};

export default function NewGame(props: Props) {
  const [opponentAddress, setOpponentAddress] = useState<string>("");
  const [move, setMove] = useState<MoveType>(MoveType.None);
  const [stake, setStake] = useState<string>("");

  const moveOptions = Object.values(MoveType)
    .map((move) => Number.parseInt(move as string))
    .filter((move) => !isNaN(move))
    .map((move) => ({
      value: move,
      label: MoveType[move]!,
    }));

  function onNewGameClick() {
    if (props.onNewGameClick) {
      props.onNewGameClick(opponentAddress, move, stake);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <label htmlFor="opponent">Opponent Address</label>
      <Input
        type="text"
        id="opponent"
        value={opponentAddress}
        onChange={setOpponentAddress}
      />

      <label htmlFor="move">Select Move</label>
      <Select
        options={moveOptions}
        id="move"
        value={move}
        onChange={(e) => setMove(Number.parseInt(e.currentTarget.value))}
      />

      <label htmlFor="stake">Stake</label>
      <Input type="text" id="stake" value={stake} onChange={setStake} />

      <Button onClick={onNewGameClick}>Create</Button>
    </div>
  );
}
